import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { walletConnect } from '@wagmi/connectors';
import { BrowserProvider, Contract, parseEther } from 'ethers';
import type { User } from '@/types/user';
import { StorageService } from './storage-service';
import { PassportService } from './passport-service';
import { PROFILE_CONTRACT_ADDRESS, PROFILE_CONTRACT_ABI } from '../config/contracts';

// Initialize Storage service
const storageService = new StorageService();
const passportService = new PassportService();

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
  getPointHistory: () => Promise<PointHistoryItem[]>;
  getBadges: () => Promise<string[]>;
  getProjectsData: () => Promise<{
    owned: string[];
    supported: string[];
    signaled: string[];
  }>;
  calculateImpactScore: () => Promise<number>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface PointHistoryItem {
  points: number;
  timestamp: number;
  action: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAdmin') === 'true';
    }
    return false;
  });

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { address, isConnected } = useAccount();
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();

  const loadUserProfile = async (address: string) => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(
        PROFILE_CONTRACT_ADDRESS,
        PROFILE_CONTRACT_ABI,
        provider
      );

      const profileData = await contract.getProfile(address);
      if (profileData.ipfsHash) {
        const profileUrl = `https://gateway.pinata.cloud/ipfs/${profileData.ipfsHash}`;
        const response = await fetch(profileUrl);
        const userData = await response.json();
        
        setUser({
          address,
          ...userData,
          isPassportVerified: Boolean(userData.passportScore),
          stampCategories: {} // Initialize empty record for stamp categories
        });
      } else {
        setUser({ 
          address,
          stampCategories: {} 
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUser({ 
        address,
        stampCategories: {} 
      });
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const connector = walletConnect({
        projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '37b5e2fccd46c838885f41186745251e',
      });
      await connectAsync({ connector });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    await disconnectAsync();
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
    try {
      if (!user?.address) throw new Error('No user connected');

      const profileData = { ...user, ...data };
      const file = new File([JSON.stringify(profileData)], 'profile.json', { type: 'application/json' });
      const ipfsHash = await storageService.uploadFile(file);

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(
        PROFILE_CONTRACT_ADDRESS,
        PROFILE_CONTRACT_ABI,
        signer
      );

      await contract.updateProfile(ipfsHash);
      await loadUserProfile(user.address);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Social functions
  const followUser = async (address: string) => {
    if (!user?.address) return;
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(PROFILE_CONTRACT_ADDRESS, PROFILE_CONTRACT_ABI, signer);
      await contract.followUser(address);
      await loadUserProfile(user.address);
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  };

  const unfollowUser = async (address: string) => {
    if (!user?.address) return;
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(PROFILE_CONTRACT_ADDRESS, PROFILE_CONTRACT_ABI, signer);
      await contract.unfollowUser(address);
      await loadUserProfile(user.address);
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  };

  // Passport verification
  const verifyPassport = async () => {
    if (!user?.address) return;
    
    try {
      setIsLoading(true);
      const { isVerified, score, stamps } = await passportService.verifyPassport(user.address);
      
      // Convert stamp categories array to record
      const categories = stamps.reduce((acc, stamp) => {
        const type = stamp.credential.type;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          passportScore: score,
          isPassportVerified: isVerified,
          stampCategories: categories
        };
      });

    } catch (error) {
      console.error('Failed to verify passport:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Project interaction functions
  const signalProject = async (projectId: string) => {
    if (!user?.address) return;
    
    try {
      setIsLoading(true);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(PROFILE_CONTRACT_ADDRESS, PROFILE_CONTRACT_ABI, signer);
      const tx = await contract.signalProject(projectId);
      await tx.wait();
      
      const projectsData = await getProjectsData();
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          projectsSignaled: projectsData.signaled
        };
      });
    } catch (error) {
      console.error('Failed to signal project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const supportProject = async (projectId: string, amount: string) => {
    if (!user?.address) return;
    
    try {
      setIsLoading(true);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(PROFILE_CONTRACT_ADDRESS, PROFILE_CONTRACT_ABI, signer);
      const tx = await contract.supportProject(projectId, parseEther(amount));
      await tx.wait();
      
      const [projectsData, pointHistory] = await Promise.all([
        getProjectsData(),
        getPointHistory()
      ]);
      
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          projectsSupported: projectsData.supported,
          totalPoints: pointHistory.reduce((acc, action) => acc + action.points, 0)
        };
      });
    } catch (error) {
      console.error('Failed to support project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getPointHistory = async (): Promise<PointHistoryItem[]> => {
    if (!user?.address) return [];
    try {
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(PROFILE_CONTRACT_ADDRESS, PROFILE_CONTRACT_ABI, provider);
      const history = await contract.getPointHistory(user.address);
      return history.map((item: any) => ({
        points: Number(item.points),
        timestamp: Number(item.timestamp),
        action: item.action
      }));
    } catch (error) {
      console.error('Error fetching point history:', error);
      return [];
    }
  };

  const getBadges = async () => {
    if (!user?.address) return [];
    try {
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(PROFILE_CONTRACT_ADDRESS, PROFILE_CONTRACT_ABI, provider);
      const profile = await contract.getExtendedProfile(user.address);
      return profile.badges || [];
    } catch (error) {
      console.error('Failed to get badges:', error);
      return [];
    }
  };

  const getProjectsData = async () => {
    if (!user?.address) return { owned: [], supported: [], signaled: [] };
    try {
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(PROFILE_CONTRACT_ADDRESS, PROFILE_CONTRACT_ABI, provider);
      const data = await contract.getProjectsData(user.address);
      return {
        owned: data.owned || [],
        supported: data.supported || [],
        signaled: data.signaled || []
      };
    } catch (error) {
      console.error('Failed to get projects data:', error);
      return { owned: [], supported: [], signaled: [] };
    }
  };

  const calculateImpactScore = async () => {
    if (!user?.address) return 0;
    try {
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(PROFILE_CONTRACT_ADDRESS, PROFILE_CONTRACT_ABI, provider);
      const profile = await contract.getExtendedProfile(user.address);
      return Number(profile.impactScore) || 0;
    } catch (error) {
      console.error('Failed to calculate impact score:', error);
      return 0;
    }
  };

  // Effect to load user data when connected
  useEffect(() => {
    if (isConnected && address) {
      loadUserProfile(address);
    } else {
      setUser(null);
    }
  }, [isConnected, address]);

  // Keep isAdmin in sync with localStorage
  useEffect(() => {
    const handleStorage = () => {
      setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const value = {
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
