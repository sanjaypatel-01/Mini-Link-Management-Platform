import express from 'express';
import { authenticateToken } from './authMiddleware.js';

const router = express.Router();

// Protect this route with authentication middleware
router.get('/user', authenticateToken, (req, res) => {
  // Your logic here
  res.json({ message: 'User details' });
});

export default router;
