import express from "express";
import passport from "passport";
import authController from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

// Local auth routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", isAuthenticated, authController.getCurrentUser);

// Email verification
router.get("/verify-email", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerification);

// Password reset
router.post("/forgot-password", authController.requestPasswordReset);
router.post("/reset-password", authController.resetPassword);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  (req, res) => {
    // Successful authentication, redirect to client
    res.redirect(
      `${process.env.CLIENT_URL || "http://localhost:5173"}/dashboard`
    );
  }
);

export default router;
