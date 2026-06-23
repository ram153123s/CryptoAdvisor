// Onboarding stores symbols (BTC, ETH...) but CoinGecko uses ids (bitcoin...).
const SYMBOL_TO_ID: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  XRP: "ripple",
  ADA: "cardano",
  DOGE: "dogecoin",
  BNB: "binancecoin",
  AVAX: "avalanche-2",
};

export interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number | null;
  image: string;
}

interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number | null;
}

export async function getPrices(symbols: string[]): Promise<CoinPrice[]> {
  const ids = symbols
    .map((s) => SYMBOL_TO_ID[s])
    .filter((id): id is string => Boolean(id));

  if (ids.length === 0) return [];

  const url =
    `https://api.coingecko.com/api/v3/coins/markets` +
    `?vs_currency=usd&ids=${ids.join(",")}` +
    `&x_cg_demo_api_key=${process.env.COINGECKO_API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`CoinGecko request failed: ${res.status}`);
  }

  const data = (await res.json()) as CoinGeckoMarket[];
  return data.map((c) => ({
    id: c.id,
    symbol: c.symbol.toUpperCase(),
    name: c.name,
    price: c.current_price,
    change24h: c.price_change_percentage_24h,
    image: c.image,
  }));
}
