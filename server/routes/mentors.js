import express from 'express';
import { MentorService } from '../services/mentorService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get available mentors
router.get('/available', authenticateToken, async (req, res) => {
  try {
    const mentors = await MentorService.getAvailableMentors(req.userId);
    res.json({ mentors });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get mentor matches for user
router.get('/matches', authenticateToken, async (req, res) => {
  try {
    const matches = await MentorService.getUserMatches(req.userId);
    res.json({ matches });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Request mentorship
router.post('/request', authenticateToken, async (req, res) => {
  try {
    const { mentorId, message } = req.body;
    const match = await MentorService.requestMentorship(req.userId, mentorId, message);
    res.json({ match });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Respond to mentorship request
router.post('/respond', authenticateToken, async (req, res) => {
  try {
    const { matchId, status, message } = req.body;
    const match = await MentorService.respondToRequest(req.userId, matchId, status, message);
    res.json({ match });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get chat messages
router.get('/chat/:matchId', authenticateToken, async (req, res) => {
  try {
    const messages = await MentorService.getChatMessages(req.userId, req.params.matchId);
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send chat message
router.post('/chat/:matchId', authenticateToken, async (req, res) => {
  try {
    const { message, messageType } = req.body;
    const chatMessage = await MentorService.sendMessage(req.userId, req.params.matchId, message, messageType);
    res.json({ message: chatMessage });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;