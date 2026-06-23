export interface NewsItem {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  imageUrl: string | null;
}

interface NewsDataArticle {
  title: string;
  link: string;
  source_id: string;
  pubDate: string;
  image_url: string | null;
}

export async function getNews(): Promise<NewsItem[]> {
  const key = process.env.NEWSDATA_API_KEY;
  const url = `https://newsdata.io/api/1/latest?apikey=${key}&q=cryptocurrency&language=en`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`News request failed: ${res.status}`);
  }

  const data = (await res.json()) as { results: NewsDataArticle[] };
  return data.results.slice(0, 6).map((a) => ({
    title: a.title,
    source: a.source_id,
    url: a.link,
    publishedAt: a.pubDate,
    imageUrl: a.image_url ?? null,
  }));
}
