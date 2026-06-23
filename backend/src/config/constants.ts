// Cache durations (ms) for dashboard data sources.
export const PRICES_TTL_MS = 60_000;
export const NEWS_TTL_MS = 900_000; // 15 min — keeps us under newsdata.io's daily limit
export const AI_TTL_MS = 21_600_000; // 6 h — keeps us under OpenRouter's free daily cap
