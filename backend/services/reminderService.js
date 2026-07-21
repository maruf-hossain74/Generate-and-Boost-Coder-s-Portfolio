const nodemailer = require("nodemailer");
const ContestReminder = require("../models/ContestReminder");
const Contest = require("../models/Contest");
const User = require("../models/User");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  return transporter;
}

async function processReminders() {
  try {
    const now = new Date();
    const pending = await ContestReminder.find({
      isSent: false,
      reminderTime: { $lte: now },
    });

    if (pending.length === 0) return;

    const transport = getTransporter();

    for (const reminder of pending) {
      try {
        const [contest, user] = await Promise.all([
          Contest.findById(reminder.contestId),
          User.findById(reminder.userId),
        ]);

        if (!contest || !user) {
          reminder.isSent = true;
          await reminder.save();
          continue;
        }

        if (transport) {
          await transport.sendMail({
            from: `"CodeFolio" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: `Reminder: ${contest.name} starts soon!`,
            html: `<h2>Contest Reminder</h2>
<p>Hi ${user.displayName || user.email},</p>
<p><strong>${contest.name}</strong> is starting soon!</p>
<p><strong>Platform:</strong> ${contest.platform}</p>
<p><strong>Start Time:</strong> ${contest.startTime.toLocaleString()}</p>
<p><a href="${contest.url}">Join Contest</a></p>`,
          });
        } else {
          console.log(
            `[Reminder] ${user.email} — ${contest.name} starting at ${contest.startTime}`
          );
        }

        reminder.isSent = true;
        await reminder.save();
      } catch {
        /* skip failed reminder */
      }
    }
  } catch {
    /* silenty fail */
  }
}

module.exports = { processReminders };
