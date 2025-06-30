const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pageId: { type: String, required: true },
  pageName: { type: String },
  accessToken: { type: String, required: true },
  connectedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Page', pageSchema);
