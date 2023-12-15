"use strict";

import express from "express";

import bcrypt from 'bcrypt';

import { User } from '../models/db.js';


const router = express.Router();

// TODO add any endpoints or middleware functions here
// Helper function to check if the user is authenticated
const isAuthenticated = (req) => {
    return req.session && req.session.userId;
  };
  
  // Controller for POST /api/login
  export const login = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Find user by username
      const user = await User.findOne({ username });
  
      // Check if user exists and compare passwords
      if (user && await bcrypt.compare(password, user.password)) {
        // Set session data to remember the user
        req.session.userId = user._id;
  
        return res.json({ message: 'Welcome! Authentication successful.' });
      } else {
        return res.status(401).json({ error: 'Authentication failed. Invalid username or password.' });
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  // Controller for GET /api/logout
  export const logout = (req, res) => {
    try {
      // Check if the user is authenticated
      if (isAuthenticated(req)) {
        // Clear session data to deauthenticate the user
        req.session.destroy((err) => {
          if (err) {
            console.error('Error during logout:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
          return res.json({ message: 'Farewell! Logout successful.' });
        });
      } else {
        return res.status(401).json({ error: 'Not authenticated. Logout failed.' });
      }
    } catch (error) {
      console.error('Error during logout:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Middleware
  const isAuthenticated = (req) => {
    return req.session && req.session.userId;
  };
  
  export const authenticateUser = async (req, res, next) => {
    try {
      // Check if the user is authenticated
      if (isAuthenticated(req)) {
        // Continue to the next middleware or route handler
        return next();
      } else {
        return res.status(401).json({ error: 'Not authenticated. Please log in.' });
      }
    } catch (error) {
      console.error('Error during authentication:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
export default router;
