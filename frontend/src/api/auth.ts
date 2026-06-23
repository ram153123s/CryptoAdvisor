import { api } from "./client";

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

export async function signup(email: string, name: string, password: string) {
  const { data } = await api.post<AuthResponse>("/auth/signup", {
    email,
    name,
    password,
  });
  return data;
}

export async function login(email: string, password: string) {
  const { data } = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return data;
}

export async function fetchMe() {
  const { data } = await api.get<{ user: User }>("/auth/me");
  return data.user;
}
