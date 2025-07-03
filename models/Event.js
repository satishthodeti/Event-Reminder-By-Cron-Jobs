const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  eventTime: Date,
  reminderSent: { type: Boolean, default: false },
  email: String
});

module.exports = mongoose.model('Event', eventSchema);
