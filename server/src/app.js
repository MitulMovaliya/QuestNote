import "express-async-errors";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "./config/passport.js";
import routes from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";
import logger from "./utils/logger.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan("combined", { stream: logger.stream }));

// Session configuration
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        process.env.MONGODB_URI || "mongodb://localhost:27017/questnote",
      touchAfter: 24 * 3600, // lazy session update
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 'none' required for cross-subdomain
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV || "development" });
});

app.use(errorHandler);

export default app;
