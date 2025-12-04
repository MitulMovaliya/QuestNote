import crypto from "crypto";
import passport from "passport";
import { User } from "../models/user.model.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../utils/email.js";
import logger from "../utils/logger.js";

// Register new user
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name,
      emailVerificationToken: verificationToken,
      emailVerificationExpiry: verificationExpiry,
      isEmailVerified: false,
    });

    // Send verification email
    await sendVerificationEmail(user.email, user.name, verificationToken);

    res.status(201).json({
      message:
        "Registration successful! Please check your email to verify your account.",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    logger.error("Register error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

// Verify email with token
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: "Verification token is required" });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification token" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpiry = null;
    await user.save();

    res.json({ message: "Email verified successfully! You can now login." });
  } catch (error) {
    logger.error("Verify email error:", error);
    res.status(500).json({ error: "Email verification failed" });
  }
};

// Resend verification email
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: "Email already verified" });
    }

    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpiry = verificationExpiry;
    await user.save();

    await sendVerificationEmail(user.email, user.name, verificationToken);

    res.json({ message: "Verification email sent successfully" });
  } catch (error) {
    logger.error("Resend verification error:", error);
    res.status(500).json({ error: "Failed to resend verification email" });
  }
};

// Login with email/password (uses passport local strategy)
export const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      logger.error("Login error:", err);
      return res.status(500).json({ error: "Login failed" });
    }

    if (!user) {
      return res
        .status(401)
        .json({ error: info.message || "Invalid credentials" });
    }

    req.logIn(user, (err) => {
      if (err) {
        logger.error("Session login error:", err);
        return res.status(500).json({ error: "Login failed" });
      }

      res.json({
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          isEmailVerified: user.isEmailVerified,
        },
      });
    });
  })(req, res, next);
};

// Logout
export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      logger.error("Logout error:", err);
      return res.status(500).json({ error: "Logout failed" });
    }

    req.session.destroy((err) => {
      if (err) {
        logger.error("Session destroy error:", err);
      }
      res.json({ message: "Logout successful" });
    });
  });
};

// Get current user
export const getCurrentUser = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      avatar: req.user.avatar,
      isEmailVerified: req.user.isEmailVerified,
    },
  });
};

// Request password reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.json({
        message: "If the email exists, a reset link has been sent",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetExpiry;
    await user.save();

    await sendPasswordResetEmail(user.email, user.name, resetToken);

    res.json({ message: "If the email exists, a reset link has been sent" });
  } catch (error) {
    logger.error("Request password reset error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
};

// Reset password with token
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ error: "Token and new password are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await user.save();

    res.json({ message: "Password reset successfully! You can now login." });
  } catch (error) {
    logger.error("Reset password error:", error);
    res.status(500).json({ error: "Password reset failed" });
  }
};

export default {
  register,
  verifyEmail,
  resendVerification,
  login,
  logout,
  getCurrentUser,
  requestPasswordReset,
  resetPassword,
};
