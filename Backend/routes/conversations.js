// routes/conversations.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Group messages by senderId and get latest message per sender
router.get('/conversations', async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: "$senderId",
          lastMessage: { $first: "$text" },
          timestamp: { $first: "$timestamp" }
        }
      },
      {
        $sort: { timestamp: -1 }
      }
    ]);

    res.json(conversations);
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

router.get('/messages/:senderId', async (req, res) => {
  try {
    const senderId = req.params.senderId;

    const messages = await Message.find({ senderId }).sort({ timestamp: 1 }); // oldest to newest
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;
