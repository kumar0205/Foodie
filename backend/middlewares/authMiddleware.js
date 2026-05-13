import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import fs from 'fs';

export const protect = async (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    let token = req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token found' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      fs.appendFileSync("auth_debug.log", `Invalid payload: ${JSON.stringify(decoded)}\n`);
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    // Find the user and exclude password field manually if needed
    const user = await User.findById(decoded.id);
    fs.appendFileSync("auth_debug.log", `User lookup for ${decoded.id}: ${user ? 'Found' : 'Not Found'}\n`);
    if (user) {
      delete user.password;
    }
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = user; // attach to request
    next();
  } catch (err) {
    fs.appendFileSync("auth_error.log", `Auth error: ${err.message}\nStack: ${err.stack}\n`);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

