import express from 'express';
import { authenticateToken } from '../middleware/AuthenticateToken.js';
import User from '../models/User.js';
import Url from '../models/UrlModel.js';

const router = express.Router();

router.get('/user', authenticateToken, async (req, res) => {
  // Use userId from token payload instead of id
  const userId = req.user.userId;
  console.log('Attempting to find user with ID:', userId);

  try {
    const user = await User.findById(userId)
      .select('-password') // Exclude password from response
      .exec();

    if (!user) {
      console.log('User not found for ID:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
});


// delete account or user
router.delete("/user/delete", authenticateToken, async (req, res) => {
  const userId = req.user.userId; // Use userId from token payload
  console.log("Attempting to delete user with ID:", userId);

  try {
    // Step 1: Delete all short links created by this user
    const deletedLinks = await Url.deleteMany({ user: userId });
    console.log("Deleted short links count:", deletedLinks.deletedCount);

    // Step 2: Delete the user account
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      console.log("User not found for ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User deleted successfully:", deletedUser);
    res.json({ message: "User and associated short links deleted successfully" });
  } catch (error) {
    console.error("Profile deletion error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});


// Update account or user details
router.put("/user/update", authenticateToken, async (req, res) => {
  const userId = req.user.userId; // Use userId from token payload
  console.log("Attempting to update user with ID:", userId);

  try {
    const { name, email, mobile } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, mobile },
      { new: true }
    ).select("-password"); // Exclude password from response

    if (!updatedUser) {
      console.log("User not found for ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User updated successfully:", updatedUser);
    res.json({ message: "Profile updated successfully!", user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});


export default router;