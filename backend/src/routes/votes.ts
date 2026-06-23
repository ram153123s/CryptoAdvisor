import { Router } from "express";
import { prisma } from "../utils/prisma.js";
import { requireAuth, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

const SECTIONS = ["prices", "news", "ai", "meme"];

// GET /api/votes -> all of the current user's votes
router.get("/", async (req: AuthRequest, res) => {
  const votes = await prisma.vote.findMany({
    where: { userId: req.userId },
    select: { section: true, itemRef: true, value: true },
  });
  res.json({ votes });
});

// POST /api/votes  { section, itemRef, value: 1 | -1 }
router.post("/", async (req: AuthRequest, res) => {
  const { section, itemRef, value } = req.body ?? {};

  if (!SECTIONS.includes(section) || typeof itemRef !== "string" || !itemRef) {
    return res.status(400).json({ error: "Invalid section or itemRef" });
  }
  if (value !== 1 && value !== -1) {
    return res.status(400).json({ error: "value must be 1 or -1" });
  }

  const where = {
    userId_section_itemRef: { userId: req.userId!, section, itemRef },
  };

  const existing = await prisma.vote.findUnique({ where });

  // Clicking the same vote again clears it (toggle off).
  if (existing && existing.value === value) {
    await prisma.vote.delete({ where });
    return res.json({ section, itemRef, value: 0 });
  }

  // Otherwise create or switch the vote.
  await prisma.vote.upsert({
    where,
    update: { value },
    create: { userId: req.userId!, section, itemRef, value },
  });

  res.json({ section, itemRef, value });
});

export default router;
