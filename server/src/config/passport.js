import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";
import logger from "../utils/logger.js";

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-password");
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Local Strategy (Email + Password)
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }

        if (!user.isActive) {
          return done(null, false, { message: "Account is deactivated" });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password" });
        }

        if (!user.isEmailVerified) {
          return done(null, false, {
            message: "Please verify your email first",
          });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        return done(null, user);
      } catch (error) {
        logger.error("Local strategy error:", error);
        return done(error);
      }
    }
  )
);

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:7675/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // User exists, update last login
          user.lastLogin = new Date();
          await user.save();
          return done(null, user);
        }

        // Check if user exists with same email
        user = await User.findOne({
          email: profile.emails[0].value.toLowerCase(),
        });

        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id;
          user.isEmailVerified = true; // Google emails are verified
          user.avatar = user.avatar || profile.photos[0]?.value;
          user.lastLogin = new Date();
          await user.save();
          return done(null, user);
        }

        // Create new user
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value.toLowerCase(),
          name: profile.displayName,
          avatar: profile.photos[0]?.value,
          isEmailVerified: true,
          isActive: true,
          lastLogin: new Date(),
        });

        return done(null, user);
      } catch (error) {
        logger.error("Google strategy error:", error);
        return done(error, null);
      }
    }
  )
);

export default passport;
