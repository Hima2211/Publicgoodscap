import { Router } from 'express';
import { supabaseAdmin as supabase } from '../supabase';
import { verifyToken } from '../middleware/auth';

const router = Router();

// Get user profile
router.get('/:address', async (req, res) => {
  const { address } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('address', address)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(data);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
});

// Update user profile
router.patch('/:address', verifyToken, async (req, res) => {
  const { address } = req.params;
  const updates = req.body;
  
  try {
    // Verify that the authenticated user is updating their own profile
    if (req.user?.id !== address) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('address', address)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Failed to update user data' });
  }
});

// Get user's projects
router.get('/:address/projects', async (req, res) => {
  const { address } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('owner_address', address);

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Error fetching user projects:', err);
    res.status(500).json({ message: 'Failed to fetch user projects' });
  }
});

// Get user's stats
router.get('/:address/stats', async (req, res) => {
  const { address } = req.params;
  
  try {
    // Fetch projects count
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id')
      .eq('owner_address', address);

    if (projectsError) throw projectsError;

    // Fetch contributions
    const { data: contributions, error: contributionsError } = await supabase
      .from('contributions')
      .select('amount')
      .eq('user_address', address);

    if (contributionsError) throw contributionsError;

    // Calculate total impact (sum of contributions)
    const impact = contributions?.reduce((total, contrib) => total + (contrib.amount || 0), 0) || 0;

    // Fetch points from activities
    const { data: activities, error: activitiesError } = await supabase
      .from('user_activities')
      .select('points')
      .eq('user_address', address);

    if (activitiesError) throw activitiesError;

    const stats = {
      totalContributions: contributions?.length || 0,
      totalPoints: activities?.reduce((total, activity) => total + (activity.points || 0), 0) || 0,
      projects: projects?.length || 0,
      impact,
    };

    res.json(stats);
  } catch (err) {
    console.error('Error fetching user stats:', err);
    res.status(500).json({ message: 'Failed to fetch user stats' });
  }
});

export default router;
