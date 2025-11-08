import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Register new user
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // Validate input lengths
    if (trimmedUsername.length < 3 || trimmedUsername.length > 50) {
      res.status(400).json({ error: 'Username must be between 3 and 50 characters' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    // Create user
    const user = await (User as any).createUser(trimmedUsername, trimmedEmail, password);

    if (!user) {
      res.status(409).json({ error: 'User with this email or username already exists' });
      return;
    }

    // Set session
    req.session.userId = user._id.toString();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ error: 'Missing email or password' });
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({ email: trimmedEmail });

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Verify password
    const isValid = await user.verifyPassword(password);

    if (!isValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Set session
    req.session.userId = user._id.toString();

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout user
router.post('/logout', (req: Request, res: Response): void => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      res.status(500).json({ error: 'Logout failed' });
      return;
    }
    res.clearCookie('mma.sid');
    res.status(200).json({ message: 'Logout successful' });
  });
});

// Get current user
router.get('/me', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.session.userId);

    if (!user) {
      req.session.destroy(() => {});
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Check authentication status
router.get('/check', (req: Request, res: Response): void => {
  res.status(200).json({
    authenticated: !!req.session.userId
  });
});

export default router;
