import express from "express";
import noteController from "../controllers/note.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(isAuthenticated);

router.post("/", noteController.createNote);
router.get("/", noteController.getNotes);
router.get("/tags", noteController.getTags);
router.get("/:id", noteController.getNoteById);
router.put("/:id", noteController.updateNote);
router.delete("/:id", noteController.deleteNote);

router.patch("/:id/pin", noteController.togglePin);
router.patch("/:id/archive", noteController.toggleArchive);

export default router;
