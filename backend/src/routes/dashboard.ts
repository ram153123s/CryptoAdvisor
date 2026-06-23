import { Router } from "express";
import { prisma } from "../utils/prisma.js";
import { requireAuth, AuthRequest } from "../middleware/auth.js";
import { cached } from "../utils/cache.js";
import { getPrices, CoinPrice } from "../services/coingecko.js";
import { getMeme, Meme } from "../services/memes.js";
import { getNews, NewsItem } from "../services/news.js";
import { getAiInsight, fallbackInsight } from "../services/ai.js";
import { PRICES_TTL_MS, NEWS_TTL_MS, AI_TTL_MS } from "../config/constants.js";

const router = Router();

router.use(requireAuth);

// GET /api/dashboard  -> { prices, meme, news, aiInsight }
router.get("/", async (req: AuthRequest, res) => {
  const pref = await prisma.preference.findUnique({
    where: { userId: req.userId },
  });
  const assets = (pref?.assets as string[] | undefined) ?? [];
  const investorType = pref?.investorType ?? null;
  const assetsKey = [...assets].sort().join(",");

  // Caching is global across all users — intentional. Each source has its own
  // fallback, so a single failure never rejects the others.
  const pricesP = (async (): Promise<CoinPrice[]> => {
    try {
      return await cached(`prices:${assetsKey}`, PRICES_TTL_MS, () =>
        getPrices(assets),
      );
    } catch {
      return [];
    }
  })();

  // Meme is fetched fresh each load so it changes every dashboard update.
  const memeP = (async (): Promise<Meme | null> => {
    try {
      return await getMeme();
    } catch {
      return null;
    }
  })();

  const newsP = (async (): Promise<NewsItem[]> => {
    try {
      return await cached("news", NEWS_TTL_MS, () => getNews());
    } catch {
      return [];
    }
  })();

  // Only successful AI insights are cached; the fallback is not, so we keep
  // retrying the real API until the rate limit resets.
  const aiP = (async (): Promise<string> => {
    try {
      return await cached(`ai:${investorType}:${assetsKey}`, AI_TTL_MS, () =>
        getAiInsight(assets, investorType),
      );
    } catch {
      return fallbackInsight(investorType);
    }
  })();

  const [prices, meme, news, aiInsight] = await Promise.all([
    pricesP,
    memeP,
    newsP,
    aiP,
  ]);

  res.json({ prices, meme, news, aiInsight });
});

export default router;
