import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { UserStats } from '../../types/user';
import { Card } from '../ui/card';
import { ethers } from 'ethers';
import { PROFILE_CONTRACT_ADDRESS, PROFILE_CONTRACT_ABI } from '../../config/contracts';

export function ProfileDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalContributions: 0,
    totalPoints: 0,
    projects: 0,
    impact: 0,
    followers: 0,
    following: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Load profile data from smart contract
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          PROFILE_CONTRACT_ADDRESS,
          PROFILE_CONTRACT_ABI,
          provider
        );

        const profile = await contract.getProfile(user?.address);
        
        setStats({
          totalContributions: profile.totalPoints.toNumber(),
          totalPoints: profile.totalPoints.toNumber(),
          projects: 0, // This will be updated from project data
          impact: 0, // This will be calculated based on contributions
          followers: profile.followersCount.toNumber(),
          following: profile.followingCount.toNumber()
        });

        // Fetch additional stats from project data
        const projectsResponse = await fetch(`/api/users/${user?.address}/projects`);
        const projectsData = await projectsResponse.json();
        
        setStats(prev => ({
          ...prev,
          projects: projectsData.length,
          impact: calculateImpact(projectsData)
        }));
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      }
    };

    if (user?.address) {
      fetchStats();
    }
  }, [user?.address]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Contributions</h3>
          <p className="mt-2 text-3xl font-semibold">{stats.totalContributions}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Points Earned</h3>
          <p className="mt-2 text-3xl font-semibold">{stats.totalPoints}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Projects Supported</h3>
          <p className="mt-2 text-3xl font-semibold">{stats.projects}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Impact Score</h3>
          <p className="mt-2 text-3xl font-semibold">{stats.impact}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {/* TODO: Add activity feed component */}
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Projects Contributed To</h2>
        {/* TODO: Add projects list component */}
      </Card>
    </div>
  );
}
