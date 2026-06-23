export interface Meme {
  url: string;
  title: string;
}

export async function getMeme(): Promise<Meme> {
  const res = await fetch("https://meme-api.com/gimme/cryptocurrencymemes");
  if (!res.ok) {
    throw new Error(`Meme request failed: ${res.status}`);
  }
  const data = (await res.json()) as { url: string; title: string };
  return { url: data.url, title: data.title };
}
