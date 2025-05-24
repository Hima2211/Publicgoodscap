import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { walletConnect } from '@wagmi/connectors';
import { BrowserProvider, Contract, parseEther } from 'ethers';
import type { User } from '@/types/user';
import { Web3StorageService } from './web3-storage';
import { PassportService } from './passport-service';
import { PROFILE_CONTRACT_ADDRESS, PROFILE_CONTRACT_ABI } from '../config/contracts';

// Initialize Web3Storage service
const web3Storage = new Web3StorageService(
  process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN || '',
  PROFILE_CONTRACT_ADDRESS,
  PROFILE_CONTRACT_ABI
);

interface AuthContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  setUser: (user: User) => void;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  followUser: (address: string) => Promise<void>;
  unfollowUser: (address: string) => Promise<void>;
  verifyPassport: () => Promise<void>;
  signalProject: (projectId: string) => Promise<void>;
  supportProject: (projectId: string, amount: string) => Promise<void>;
  getPointHistory: () => Promise<any[]>;
  getBadges: () => Promise<string[]>;
  getProjectsData: () => Promise<{
    owned: string[];
    supported: string[];
    signaled: string[];
  }>;
  calculateImpactScore: () => Promise<number>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAdmin') === 'true';
    }
    return false;
  });

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();

  const walletConnectConnector = walletConnect({
    projectId: '37b5e2fccd46c838885f41186745251e',
  });

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      await connect({ connector: walletConnectConnector });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    disconnect();
    setUser(null);
    localStorage.removeItem('user');
  };

  // Admin functions
  const login = (password: string) => {
    if (password === 'admin123') {
      setIsAdmin(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('isAdmin', 'true');
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAdmin');
    }
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<User>) => {
    if (!user?.address) return;
    
    try {
      const cid = await web3Storage.uploadProfileData({
        ...user,
        ...data,
        updatedAt: Date.now()
      });
      
      setUser(prev => prev ? { ...prev, ...data } : null);
      return cid;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  const followUser = async (address: string) => {
    await web3Storage.followUser(address);
    // Reload user profile to get updated following count
    if (user?.address) {
      await loadUserProfile(user.address);
    }
  };

  const unfollowUser = async (address: string) => {
    await web3Storage.unfollowUser(address);
    // Reload user profile to get updated following count
    if (user?.address) {
      await loadUserProfile(user.address);
    }
  };

  // Profile contract and passport service
  const [profileContract, setProfileContract] = useState<Contract | null>(null);
  const passportService = new PassportService();

  // Initialize contract
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        PROFILE_CONTRACT_ADDRESS,
        PROFILE_CONTRACT_ABI,
        signer
      );
      setProfileContract(contract);
    }
  }, []);

  const verifyPassport = async () => {
    if (!user?.address) return;
    
    try {
      setIsLoading(true);
      const { isVerified, score, stamps } = await passportService.verifyPassport(user.address);
      
      // Update profile contract
      if (profileContract) {
        await profileContract.verifyPassport(user.address, Math.floor(score * 100));
      }

      // Update local user state
      const stampCategories = passportService.getStampCategories(stamps);
      setUser(prev => prev ? {
        ...prev,
        passportScore: score,
        isPassportVerified: isVerified,
        stampCategories
      } : null);

    } catch (error) {
      console.error('Failed to verify passport:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signalProject = async (projectId: string) => {
    if (!user?.address || !profileContract) return;
    
    try {
      setIsLoading(true);
      const tx = await profileContract.signalProject(projectId);
      await tx.wait();
      
      // Update local state
      const projectsData = await getProjectsData();
      setUser(prev => prev ? {
        ...prev,
        projectsSignaled: projectsData.signaled
      } : null);
    } catch (error) {
      console.error('Failed to signal project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const supportProject = async (projectId: string, amount: string) => {
    if (!user?.address || !profileContract) return;
    
    try {
      setIsLoading(true);
      const tx = await profileContract.supportProject(projectId, parseEther(amount));
      await tx.wait();
      
      // Update local state
      const [projectsData, pointHistory] = await Promise.all([
        getProjectsData(),
        getPointHistory()
      ]);
      
      setUser(prev => prev ? {
        ...prev,
        projectsSupported: projectsData.supported,
        totalPoints: pointHistory.reduce((acc, action) => acc + action.points, 0)
      } : null);
    } catch (error) {
      console.error('Failed to support project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getPointHistory = async () => {
    if (!user?.address || !profileContract) return [];
    
    try {
      const history = await profileContract.getPointHistory(user.address);
      return history.actionTypes.map((type: string, i: number) => ({
        type,
        points: history.points[i].toNumber(),
        timestamp: history.timestamps[i].toNumber(),
        metadata: history.metadata[i]
      }));
    } catch (error) {
      console.error('Failed to get point history:', error);
      return [];
    }
  };

  const getBadges = async () => {
    if (!user?.address || !profileContract) return [];
    
    try {
      const profile = await profileContract.getExtendedProfile(user.address);
      return profile.badges || [];
    } catch (error) {
      console.error('Failed to get badges:', error);
      return [];
    }
  };

  const getProjectsData = async () => {
    if (!user?.address || !profileContract) return { owned: [], supported: [], signaled: [] };
    
    try {
      const data = await profileContract.getProjectsData(user.address);
      return {
        owned: data.owned,
        supported: data.supported,
        signaled: data.signaled
      };
    } catch (error) {
      console.error('Failed to get projects data:', error);
      return { owned: [], supported: [], signaled: [] };
    }
  };

  const calculateImpactScore = async () => {
    if (!user?.address || !profileContract) return 0;
    
    try {
      const profile = await profileContract.getExtendedProfile(user.address);
      return profile.impactScore.toNumber();
    } catch (error) {
      console.error('Failed to calculate impact score:', error);
      return 0;
    }
  };

  // Enhanced fetchUserData function
  const fetchUserData = async (address: string) => {
    try {
      setIsLoading(true);
      
      // Fetch on-chain profile data
      if (profileContract) {
        const [extendedProfile, projectsData, pointHistory] = await Promise.all([
          profileContract.getExtendedProfile(address),
          profileContract.getProjectsData(address),
          profileContract.getPointHistory(address)
        ]);

        // Fetch Passport data
        const { score: passportScore, isVerified, stamps } = await passportService.verifyPassport(address);
        
        const userData: User = {
          address,
          ensName: extendedProfile.ensName,
          passportScore,
          isPassportVerified: isVerified,
          stampCategories: passportService.getStampCategories(stamps),
          totalPoints: extendedProfile.totalPoints.toNumber(),
          totalContributions: extendedProfile.totalContributions.toNumber(),
          impactScore: extendedProfile.impactScore.toNumber(),
          isProjectManager: extendedProfile.isProjectManager,
          projectsOwned: projectsData.owned,
          projectsSupported: projectsData.supported,
          projectsSignaled: projectsData.signaled,
          createdAt: extendedProfile.createdAt.toNumber(),
          updatedAt: extendedProfile.updatedAt.toNumber()
        };

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync user data with wallet connection
  useEffect(() => {
    const fetchUserData = async () => {
      if (isConnected && address) {
        try {
          const response = await fetch(`/api/users/${address}`);
          if (response.ok) {
            const userData = await response.json();
            setUser({ ...userData, address });
            localStorage.setItem('user', JSON.stringify({ ...userData, address }));
          } else if (response.status === 404) {
            // Create new user profile if it doesn't exist
            const newUser: User = { address };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [isConnected, address]);

  // Keep isAdmin in sync with localStorage
  useEffect(() => {
    const handleStorage = () => {
      setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{
      isAdmin,
      login,
      logout,
      user,
      isAuthenticated: isConnected && !!user,
      isLoading,
      connectWallet,
      disconnectWallet,
      setUser,
      updateUserProfile,
      followUser,
      unfollowUser,
      verifyPassport,
      signalProject,
      supportProject,
      getPointHistory,
      getBadges,
      getProjectsData,
      calculateImpactScore,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
