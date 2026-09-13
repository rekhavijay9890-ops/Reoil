import { createHmac, randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { getSupabase, isSupabaseConfigured } from "./supabase";

const scryptAsync = promisify(scrypt);

export type CustomerProfile = {
  id: string;
  phone: string;
  name: string;
  email: string;
  createdAt: string;
};

type ProfileRow = {
  id: string;
  phone: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
};

function authSecret() {
  return process.env.CUSTOMER_AUTH_SECRET ?? process.env.ADMIN_KEY ?? "reoil-dev-secret";
}

export function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "").replace(/^91/, "").slice(-10);
}

export function phoneToEmail(phone: string) {
  return `${normalizePhone(phone)}@reoil.app`;
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

async function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hash, "hex");
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}

function rowToProfile(row: ProfileRow): CustomerProfile {
  return {
    id: row.id,
    phone: row.phone,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
  };
}

export async function registerCustomer(input: {
  phone: string;
  name: string;
  email: string;
  password: string;
}): Promise<CustomerProfile> {
  if (!isSupabaseConfigured()) {
    throw new Error("Registration requires Supabase. See docs/SUPABASE.md");
  }

  const phone = normalizePhone(input.phone);
  if (phone.length < 10) {
    throw new Error("Enter a valid 10-digit mobile number.");
  }
  if (input.password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const supabase = getSupabase();
  const passwordHash = await hashPassword(input.password);

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      phone,
      name: input.name.trim(),
      email: input.email.trim(),
      password_hash: passwordHash,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("This phone number is already registered.");
    }
    throw new Error(error.message);
  }

  return rowToProfile(data as ProfileRow);
}

export async function loginCustomer(phone: string, password: string): Promise<CustomerProfile> {
  if (!isSupabaseConfigured()) {
    throw new Error("Login requires Supabase. See docs/SUPABASE.md");
  }

  const normalized = normalizePhone(phone);
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("phone", normalized)
    .maybeSingle();

  if (error || !data) {
    throw new Error("Invalid phone or password.");
  }

  const valid = await verifyPassword(password, (data as ProfileRow).password_hash);
  if (!valid) {
    throw new Error("Invalid phone or password.");
  }

  return rowToProfile(data as ProfileRow);
}

export function createCustomerToken(profile: CustomerProfile) {
  const payload = {
    profileId: profile.id,
    phone: profile.phone,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 30,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", authSecret()).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyCustomerToken(token: string): { profileId: string; phone: string } | null {
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;

  const expected = createHmac("sha256", authSecret()).update(data).digest("base64url");
  if (expected !== sig) return null;

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as {
      profileId: string;
      phone: string;
      exp: number;
    };
    if (!payload.profileId || !payload.exp || Date.now() > payload.exp) return null;
    return { profileId: payload.profileId, phone: payload.phone };
  } catch {
    return null;
  }
}

export function getBearerToken(request: Request) {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7);
}
