import { api } from "./client";

export type VoteSection = "prices" | "news" | "ai" | "meme";

// value is -1 / +1 for a cast vote, 0 once it has been toggled off.
export interface Vote {
  section: VoteSection;
  itemRef: string;
  value: number;
}

export async function fetchVotes() {
  const { data } = await api.get<{ votes: Vote[] }>("/votes");
  return data.votes;
}

export async function postVote(
  section: VoteSection,
  itemRef: string,
  value: 1 | -1,
) {
  const { data } = await api.post<Vote>("/votes", { section, itemRef, value });
  return data;
}
