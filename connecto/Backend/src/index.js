import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma/index.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main endpoint to save creator profile
app.post('/api/creators', async (req, res) => {
  try {
    const {
      email,
      password,
      phone,
      socialHandles, // Array of { platform, handle, url, follower_count, profile_image_url }
      categories,    // Array of strings
      audience_primary_age_min,
      audience_primary_age_max,
      audience_top_location,
      audience_gender_split,
      past_collaborations
    } = req.body;

    // Validate required fields (basic validation)
    if (!email || !password || !phone || !categories || categories.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Duplicate Check
    const existingUser = await prisma.creatorProfile.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // Password Hashing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Default values since they might not be fully provided in this basic form
    const creator_location = 'Not Specified'; 

    // Create CreatorProfile
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
        // Assuming past_collaborations might be saved somewhere or just ignored if no schema field
        
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
      include: {
        social_profiles: true
      }
    });

    const token = jwt.sign({ id: newProfile.id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });

    res.status(201).json({ message: 'Creator profile created successfully', data: newProfile, token });
  } catch (error) {
    console.error('Error creating profile:', error);
    // Handle specific Prisma errors like unique constraint violations
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(409).json({ error: 'A profile with this email already exists.' });
    }
    res.status(500).json({ error: 'Internal server error while creating profile' });
  }
});

// Login Route
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

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });

    res.status(200).json({ message: 'Login successful', token, data: user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
