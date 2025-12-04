// Middleware to check if user is authenticated
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Authentication required" });
};

// Middleware to check if email is verified
export const isEmailVerified = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isEmailVerified) {
    return next();
  }
  res.status(403).json({ error: "Email verification required" });
};
