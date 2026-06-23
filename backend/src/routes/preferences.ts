import { Router } from "express";
import { prisma } from "../utils/prisma.js";
import { requireAuth, AuthRequest } from "../middleware/auth.js";

const router = Router();

// Every preferences route requires a logged-in user.
router.use(requireAuth);

// GET /api/preferences
router.get("/", async (req: AuthRequest, res) => {
  const pref = await prisma.preference.findUnique({
    where: { userId: req.userId },
  });

  if (!pref) {
    return res.json({
      assets: [],
      contentTypes: [],
      investorType: null,
      onboarded: false,
    });
  }

  res.json({
    assets: pref.assets,
    contentTypes: pref.contentTypes,
    investorType: pref.investorType,
    onboarded: pref.onboarded,
  });
});

// PUT /api/preferences
router.put("/", async (req: AuthRequest, res) => {
  const { assets, contentTypes, investorType } = req.body ?? {};

  if (
    !Array.isArray(assets) ||
    !Array.isArray(contentTypes) ||
    typeof investorType !== "string"
  ) {
    return res.status(400).json({
      error:
        "assets and contentTypes must be arrays and investorType must be a string",
    });
  }

  const pref = await prisma.preference.upsert({
    where: { userId: req.userId },
    update: { assets, contentTypes, investorType, onboarded: true },
    create: {
      userId: req.userId!,
      assets,
      contentTypes,
      investorType,
      onboarded: true,
    },
  });

  res.json({
    assets: pref.assets,
    contentTypes: pref.contentTypes,
    investorType: pref.investorType,
    onboarded: pref.onboarded,
  });
});

export default router;
