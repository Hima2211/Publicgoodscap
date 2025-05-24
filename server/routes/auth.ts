import { Router } from 'express';
import { supabaseAdmin } from '../supabase';
import { verifyMessage } from 'ethers';
import { PassportService } from '../lib/passport-service';

const router = Router();
const passportService = new PassportService();

// Request nonce for signing
router.post('/nonce', async (req, res) => {
  const { address } = req.body;
  
  if (!address) {
    return res.status(400).json({ message: 'Address is required' });
  }

  try {
    const nonce = Math.floor(Math.random() * 1000000).toString();
    const message = `Sign this message to authenticate with BuidlMarketCap\nNonce: ${nonce}`;

    // Store nonce in Supabase for verification
    await supabaseAdmin
      .from('auth_nonces')
      .upsert({
        address: address.toLowerCase(),
        nonce,
        created_at: new Date().toISOString()
      });

    res.json({ message });
  } catch (error) {
    console.error('Error generating nonce:', error);
    res.status(500).json({ message: 'Failed to generate nonce' });
  }
});

// Verify signature and authenticate
router.post('/verify', async (req, res) => {
  const { address, signature } = req.body;
  
  if (!address || !signature) {
    return res.status(400).json({ message: 'Address and signature are required' });
  }

  try {
    // Get stored nonce
    const { data: nonceData } = await supabaseAdmin
      .from('auth_nonces')
      .select('nonce')
      .eq('address', address.toLowerCase())
      .single();

    if (!nonceData) {
      return res.status(401).json({ message: 'Invalid nonce' });
    }

    const message = `Sign this message to authenticate with BuidlMarketCap\nNonce: ${nonceData.nonce}`;
    
    // Verify signature
    const recoveredAddress = verifyMessage(message, signature);
    
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    // Get or create user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        address: address.toLowerCase(),
        last_login: new Date().toISOString()
      })
      .select()
      .single();

    if (profileError) throw profileError;

    // Check Passport verification if available
    try {
      const { score, isVerified } = await passportService.verifyPassport(address);
      if (score && isVerified) {
        await supabaseAdmin
          .from('profiles')
          .update({
            passport_score: score,
            is_passport_verified: isVerified
          })
          .eq('id', profile.id);
      }
    } catch (passportError) {
      console.warn('Passport verification failed:', passportError);
    }

    // Generate session
    const { data: { session }, error: authError } = await supabaseAdmin.auth.admin.createSession({
      user_id: profile.id,
      properties: {
        address: address.toLowerCase()
      }
    });

    if (authError) throw authError;

    // Clear used nonce
    await supabaseAdmin
      .from('auth_nonces')
      .delete()
      .eq('address', address.toLowerCase());

    res.json({
      session: session.access_token,
      user: profile
    });
  } catch (error) {
    console.error('Error verifying signature:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    await supabaseAdmin.auth.admin.signOut(token);
    res.json({ message: 'Successfully logged out' });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ message: 'Failed to logout' });
  }
});

export default router;
