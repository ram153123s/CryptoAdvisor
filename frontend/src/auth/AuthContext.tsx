import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMe, User } from "../api/auth";
import { getToken, setToken, clearToken } from "../api/client";

interface AuthValue {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Keep the token in React state (seeded from localStorage) so auth changes
  // actually trigger a re-render. localStorage on its own is not reactive.
  const [token, setTokenState] = useState<string | null>(() => getToken());

  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    enabled: !!token,
    retry: false,
  });

  // A token that the server rejects is useless — drop it.
  useEffect(() => {
    if (isError) {
      clearToken();
      setTokenState(null);
    }
  }, [isError]);

  const login = (newToken: string, user: User) => {
    setToken(newToken);
    setTokenState(newToken);
    queryClient.setQueryData(["me"], user);
  };

  const logout = () => {
    clearToken();
    setTokenState(null);
    // Wipe ALL cached data so the next user never sees the previous one's
    // me / preferences / dashboard.
    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{ user: data ?? null, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
