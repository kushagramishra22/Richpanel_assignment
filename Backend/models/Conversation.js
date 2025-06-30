const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  messages: [
    {
      text: String,
      timestamp: Date,
      isAgent: { type: Boolean, default: false },
    }
  ],
  lastMessageTimestamp: { type: Date, required: true }
});

module.exports = mongoose.model('Conversation', conversationSchema);
