const cron = require('node-cron');
const Event = require('../models/Event');
const sendEmail = require('../utils/sendEmail');

cron.schedule('*/5 * * * *', async () => {
  const now = new Date();
  const upcoming = new Date(now.getTime() + 10 * 60000); // 10 mins ahead

  const events = await Event.find({
    eventTime: { $lte: upcoming, $gt: now },
    reminderSent: false
  });

  for (const event of events) {
    await sendEmail({
      to: event.email,
      subject: `Reminder: ${event.title}`,
      text: `Don't forget your event: ${event.description} at ${event.eventTime}`
    });

    event.reminderSent = true;
    await event.save();
    console.log(`📧 Reminder sent to ${event.email} for event: ${event.title}`);
  }
  console.log(`🔄 Reminder job executed at ${now.toISOString()}`);
});
