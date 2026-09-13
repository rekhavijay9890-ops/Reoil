import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CollectorUser } from "../lib/api";
import { loginCollector } from "../lib/api";
import { clearSession, loadSession, saveSession } from "../lib/auth-storage";

type AuthContextValue = {
  user: CollectorUser | null;
  token: string | null;
  loading: boolean;
  signIn: (phone: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CollectorUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession()
      .then((session) => {
        if (session) {
          setUser(session.user);
          setToken(session.token);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      async signIn(phone, password) {
        const result = await loginCollector(phone, password);
        await saveSession(result.token, result.collector);
        setUser(result.collector);
        setToken(result.token);
      },
      async signOut() {
        await clearSession();
        setUser(null);
        setToken(null);
      },
    }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
