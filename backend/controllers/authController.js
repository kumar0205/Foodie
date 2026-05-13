import jwt from 'jsonwebtoken';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase.js";
import User from '../models/userModel.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const registerUser = async (req, res) => {
  const { name, email, password, role = 'customer' } = req.body;
  try {
    // 1. Check if user already exists in local/Firestore first
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Create user in Firebase Authentication
    const fbUserCred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = fbUserCred.user.uid;

    // 3. Create user profile in Firestore
    const user = await User.create({ _id: uid, id: uid, name, email, password: "", role });

    // 4. Generate JWT for existing auth flow compatibility
    const token = generateToken(uid);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      user: { _id: uid, id: uid, name: name, email: email, role },
      token: token,
      message: 'Registration successful',
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Sign in via Firebase Authentication
    const fbUserCred = await signInWithEmailAndPassword(auth, email, password);
    const uid = fbUserCred.user.uid;

    // 2. Retrieve profile from Firestore
    const user = await User.findById(uid);
    if (!user) {
      return res.status(401).json({ message: 'User not found in Firestore' });
    }

    // 3. Generate JWT for existing auth flow compatibility
    const token = generateToken(uid);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      user: { _id: uid, id: uid, name: user.name, email: user.email, role: user.role || 'customer' },
      token: token,
      message: 'Login successful',
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
  });

  res.status(200).json({ success: true, message: 'User logged out successfully' });
};
