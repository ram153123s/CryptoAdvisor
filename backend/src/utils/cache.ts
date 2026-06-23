type Entry = { value: unknown; expires: number };

const store = new Map<string, Entry>();

// Returns the cached value if still fresh, otherwise runs fn(), caches it, and
// returns it. Keeps us under the free API rate limits.
export async function cached<T>(
  key: string,
  ttlMs: number,
  fn: () => Promise<T>,
): Promise<T> {
  const hit = store.get(key);
  if (hit && hit.expires > Date.now()) {
    return hit.value as T;
  }

  const value = await fn();
  store.set(key, { value, expires: Date.now() + ttlMs });
  return value;
}
