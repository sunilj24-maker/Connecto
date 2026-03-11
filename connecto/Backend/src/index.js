import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma/index.js';
import { sendOtpEmail } from './utils/mailer.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*', // Allows all origins (localhost and vercel/railway frontends)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ─── Helper: generate 6-digit OTP ─────────────────────────────────────────────
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ─── STEP 1: Request OTP ──────────────────────────────────────────────────────
// POST /api/auth/request-otp  { email }
app.post('/api/auth/request-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });

    const otp = generateOtp();
    const expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Upsert: if a record for this email exists, overwrite the OTP
    await prisma.otpVerification.upsert({
      where: { email },
      update: { otp, expires_at },
      create: { email, otp, expires_at },
    });

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: 'OTP sent to your email.' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }
});

// ─── STEP 2: Verify OTP ───────────────────────────────────────────────────────
// POST /api/auth/verify-otp  { email, otp }
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required.' });

    const record = await prisma.otpVerification.findUnique({ where: { email } });

    if (!record) return res.status(400).json({ error: 'No OTP request found for this email.' });
    if (record.otp !== otp) return res.status(400).json({ error: 'Invalid verification code.' });
    if (new Date() > record.expires_at) return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });

    // OTP is valid — issue a short-lived "verified" token so frontend can proceed to Step 3
    const verifiedToken = jwt.sign(
      { email, verified: true },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '15m' }
    );

    res.status(200).json({ message: 'Email verified.', verifiedToken });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Internal server error during OTP verification.' });
  }
});

// ─── STEP 3: Set Password & Create Account ────────────────────────────────────
// POST /api/auth/register  { verifiedToken, password }
app.post('/api/auth/register', async (req, res) => {
  try {
    const { verifiedToken, password } = req.body;
    if (!verifiedToken || !password) return res.status(400).json({ error: 'Missing required fields.' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    // Validate the verified token
    let payload;
    try {
      payload = jwt.verify(verifiedToken, process.env.JWT_SECRET || 'secret_key');
    } catch {
      return res.status(401).json({ error: 'Session expired. Please verify your email again.' });
    }

    if (!payload.verified) return res.status(401).json({ error: 'Email not verified.' });

    const email = payload.email;

    // Check if account already exists
    const existingUser = await prisma.creatorProfile.findUnique({ where: { email } });

    const hashedPassword = await bcrypt.hash(password, 10);

    let profile;
    if (existingUser) {
      // Update password if they already have a profile (e.g., forgot password flow)
      profile = await prisma.creatorProfile.update({
        where: { email },
        data: { password: hashedPassword },
      });
    } else {
      // Create new profile with minimal defaults
      profile = await prisma.creatorProfile.create({
        data: {
          email,
          password: hashedPassword,
          creator_location: 'Not Specified',
          areas_of_interest: [],
          audience_primary_age_min: 0,
          audience_primary_age_max: 99,
          audience_top_locations: [],
        },
      });
    }

    // Clean up the OTP record
    await prisma.otpVerification.deleteMany({ where: { email } });

    // Issue permanent auth token
    const token = jwt.sign({ id: profile.id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });

    res.status(201).json({ message: 'Account created successfully.', token, data: { id: profile.id, email: profile.email } });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// ─── Login Route ──────────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await prisma.creatorProfile.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });

    res.status(200).json({ message: 'Login successful', token, data: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// ─── Create/Update Full Creator Profile ──────────────────────────────────────
app.post('/api/creators', async (req, res) => {
  try {
    const {
      email,
      password,
      phone,
      socialHandles,
      categories,
      audience_primary_age_min,
      audience_primary_age_max,
      audience_top_location,
      audience_gender_split,
    } = req.body;

    if (!email || !password || !phone || !categories || categories.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingUser = await prisma.creatorProfile.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const creator_location = 'Not Specified';

    const newProfile = await prisma.creatorProfile.create({
      data: {
        email,
        password: hashedPassword,
        phone,
        creator_location,
        areas_of_interest: categories,
        audience_primary_age_min: audience_primary_age_min || 0,
        audience_primary_age_max: audience_primary_age_max || 99,
        audience_top_locations: audience_top_location ? [audience_top_location] : [],
        audience_gender_split: audience_gender_split || null,
        social_profiles: {
          create: (socialHandles || []).map(sh => ({
            platform: sh.platform,
            handle: sh.handle,
            url: sh.url || '',
            follower_count: sh.follower_count || 0,
            profile_image_url: sh.profile_image_url || null
          }))
        }
      },
      include: { social_profiles: true }
    });

    const token = jwt.sign({ id: newProfile.id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });

    res.status(201).json({ message: 'Creator profile created successfully', data: newProfile, token });
  } catch (error) {
    console.error('Error creating profile:', error);
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(409).json({ error: 'A profile with this email already exists.' });
    }
    res.status(500).json({ error: 'Internal server error while creating profile' });
  }
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
