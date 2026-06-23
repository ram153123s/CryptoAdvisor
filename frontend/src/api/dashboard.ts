import { api } from "./client";

export interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number | null;
  image: string;
}

export interface Meme {
  url: string;
  title: string;
}

export interface NewsItem {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  imageUrl: string | null;
}

interface DashboardData {
  prices: CoinPrice[];
  meme: Meme | null;
  news: NewsItem[];
  aiInsight: string;
}

export async function fetchDashboard() {
  const { data } = await api.get<DashboardData>("/dashboard");
  return data;
}
