import express from "express";
import healthController from "../controllers/healthController.js";
import authRoutes from "./auth.routes.js";
import noteRoutes from "./note.routes.js";

const router = express.Router();

router.get("/health", healthController.getHealth);
router.use("/auth", authRoutes);
router.use("/notes", noteRoutes);

export default router;
