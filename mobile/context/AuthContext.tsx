import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AuthUser, UserRole } from "../lib/auth-storage";
import { clearSession, loadSession, saveSession } from "../lib/auth-storage";
import { login as apiLogin, loginCollector, register as apiRegister } from "../lib/api";
import { setupPushNotifications } from "../lib/push";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  role: UserRole | null;
  isCollector: boolean;
  signIn: (phone: string, password: string) => Promise<void>;
  signInCollector: (phone: string, password: string) => Promise<void>;
  signUp: (input: {
    phone: string;
    name: string;
    email: string;
    password: string;
    accountType?: "home" | "business";
  }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession()
      .then((session) => {
        if (session) {
          setUser(session.user);
          setToken(session.token);
          if (session.user.role === "customer") {
            setupPushNotifications(session.token).catch(() => {});
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      role: user?.role ?? null,
      isCollector: user?.role === "collector",
      async signIn(phone, password) {
        const result = await apiLogin(phone, password);
        const authUser: AuthUser = { ...result.user, role: "customer" };
        await saveSession(result.token, authUser);
        setUser(authUser);
        setToken(result.token);
        setupPushNotifications(result.token).catch(() => {});
      },
      async signInCollector(phone, password) {
        const result = await loginCollector(phone, password);
        const authUser: AuthUser = {
          id: result.collector.id,
          phone: result.collector.phone,
          name: result.collector.name,
          role: "collector",
        };
        await saveSession(result.token, authUser);
        setUser(authUser);
        setToken(result.token);
      },
      async signUp(input) {
        const result = await apiRegister(input);
        const authUser: AuthUser = { ...result.user, role: "customer" };
        await saveSession(result.token, authUser);
        setUser(authUser);
        setToken(result.token);
        setupPushNotifications(result.token).catch(() => {});
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
