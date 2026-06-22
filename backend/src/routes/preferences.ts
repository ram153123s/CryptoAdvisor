import { Router } from "express";

const router = Router();

// GET /api/preferences
router.get("/", (_req, res) =>
  res.status(501).json({ todo: "get preferences" }),
);

// PUT /api/preferences
router.put("/", (_req, res) =>
  res.status(501).json({ todo: "save preferences" }),
);

export default router;
