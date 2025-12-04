import express from "express";
import healthController from "../controllers/healthController.js";
import authRoutes from "./auth.routes.js";

const router = express.Router();

router.get("/health", healthController.getHealth);
router.use("/auth", authRoutes);

export default router;
