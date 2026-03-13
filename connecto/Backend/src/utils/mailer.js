import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import dns from 'dns';

// Force Node.js to prefer IPv4 for all DNS lookups (bypasses Render IPv6 issues)
dns.setDefaultResultOrder('ipv4first');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use STARTTLS instead of implicit SSL
  family: 4, // force IPv4
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection on startup
transporter.verify((error,success) => {
  if (error) {
    console.error('❌ SMTP connection failed:', error.message);
    console.error('   User:', process.env.GMAIL_USER);
    console.error('   Password length:', process.env.GMAIL_APP_PASSWORD?.length);
  } else {
    console.log('✅ SMTP connection verified — ready to send emails with Gmail');
  }
});

export async function sendOtpEmail(email, otp) {
  await transporter.sendMail({
    from: `"Connecto" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Your Connecto Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="font-size: 24px; font-weight: 900; color: #000; margin-bottom: 8px;">Verify your email</h2>
        <p style="color: #64748b; font-size: 15px; margin-bottom: 32px;">Use the code below to complete your sign-up for Connecto. This code expires in <strong>10 minutes</strong>.</p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; text-align: center; letter-spacing: 0.4em; font-size: 36px; font-weight: 900; color: #000; margin-bottom: 32px;">
          ${otp}
        </div>
        <p style="color: #94a3b8; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}
