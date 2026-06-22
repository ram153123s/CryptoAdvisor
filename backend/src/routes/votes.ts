import { Router } from "express";

const router = Router();

// POST /api/votes  { section, itemRef, vote }
router.post("/", (_req, res) => res.status(501).json({ todo: "vote" }));

export default router;
