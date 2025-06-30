const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  recipientId: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, required: true },
  isAgent: { type: Boolean, default: false },
});

module.exports = mongoose.model('Message', messageSchema);



