# Badr-CV

## Contact form backend

This project includes a simple Node.js backend to send contact form submissions through SMTP.

### Setup

1. Install dependencies:
   npm install
2. Create a local environment file by copying `.env.example`:
   cp .env.example .env
3. Fill in your SMTP credentials and recipient email in `.env`.
4. Start the app:
   npm start

The site will be served on http://localhost:3000.

### Gmail example

For Gmail, use an app password instead of your normal password:

- SMTP_HOST=smtp.gmail.com
- SMTP_PORT=587
- SMTP_USER=your-email@gmail.com
- SMTP_PASS=your-app-password
- CONTACT_TO_EMAIL=baderayman971@gmail.com
