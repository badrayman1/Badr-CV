require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const toEmail = process.env.CONTACT_TO_EMAIL || 'baderayman971@gmail.com';

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

app.post('/api/contact', async (req, res) => {
  const { name = '', email = '', subject = '', message = '' } = req.body || {};

  if (!name.trim() || !email.trim() || !message.trim()) {
    return res.status(400).json({
      ok: false,
      message: 'Name, email, and message are required.'
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      ok: false,
      message: 'Please provide a valid email address.'
    });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return res.status(503).json({
      ok: false,
      message: 'Email server is not configured. Add SMTP_HOST, SMTP_USER, SMTP_PASS, and CONTACT_TO_EMAIL to your environment.'
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || 'false') === 'true',
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    await transporter.sendMail({
      from: `"${name.trim()}" <${smtpUser}>`,
      replyTo: email.trim(),
      to: toEmail,
      subject: subject.trim() || 'Project Inquiry',
      text: [
        `Name: ${name.trim()}`,
        `Email: ${email.trim()}`,
        '',
        'Message:',
        message.trim()
      ].join('\n')
    });

    return res.json({
      ok: true,
      message: 'Message sent successfully.'
    });
  } catch (error) {
    console.error('Email send failed:', error);
    return res.status(500).json({
      ok: false,
      message: 'The message could not be sent. Please try again later.'
    });
  }
});

app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
