import { Router } from "express";

const router = Router();

// GET /api/dashboard  -> { news, prices, insight, meme }
router.get("/", (_req, res) => res.status(501).json({ todo: "dashboard" }));

export default router;
