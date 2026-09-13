import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "reoil_auth_token";
const USER_KEY = "reoil_auth_user";

export type AuthUser = {
  id: string;
  phone: string;
  name: string;
  email: string;
  accountType?: "home" | "business";
  createdAt: string;
};

export async function saveSession(token: string, user: AuthUser) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function loadSession(): Promise<{ token: string; user: AuthUser } | null> {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  const raw = await SecureStore.getItemAsync(USER_KEY);
  if (!token || !raw) return null;
  try {
    return { token, user: JSON.parse(raw) as AuthUser };
  } catch {
    return null;
  }
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}
