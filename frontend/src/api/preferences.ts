import { api } from "./client";

export interface Preferences {
  assets: string[];
  contentTypes: string[];
  investorType: string | null;
  onboarded: boolean;
}

export async function fetchPreferences() {
  const { data } = await api.get<Preferences>("/preferences");
  return data;
}

export async function savePreferences(input: {
  assets: string[];
  contentTypes: string[];
  investorType: string | null;
}) {
  const { data } = await api.put<Preferences>("/preferences", input);
  return data;
}
