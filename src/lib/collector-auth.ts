import { createHmac } from "crypto";
import { verifyPassword } from "./password";
import { getCollectorByPhone, type Collector } from "./collector-store";

function authSecret() {
  return process.env.COLLECTOR_AUTH_SECRET ?? process.env.ADMIN_KEY ?? "reoil-dev-secret";
}

export async function loginCollector(phone: string, password: string): Promise<Collector> {
  const row = await getCollectorByPhone(phone);
  if (!row) {
    throw new Error("Invalid phone or password.");
  }

  const valid = await verifyPassword(password, row.password_hash);
  if (!valid) {
    throw new Error("Invalid phone or password.");
  }

  const status = row.onboarding_status ?? "approved";
  if (status === "pending") {
    throw new Error("Your application is pending approval. We will notify you once approved.");
  }
  if (status === "rejected") {
    throw new Error("Your application was not approved. Contact Reoil support.");
  }
  if (!row.active) {
    throw new Error("Your account is disabled. Contact Reoil support.");
  }

  return {
    id: row.id,
    phone: row.phone,
    name: row.name,
    active: row.active,
    onboardingStatus: status as Collector["onboardingStatus"],
    city: row.city ?? undefined,
    vehicleType: row.vehicle_type ?? undefined,
    createdAt: row.created_at,
    approvedAt: row.approved_at ?? undefined,
  };
}

export function createCollectorToken(collector: Collector) {
  const payload = {
    collectorId: collector.id,
    phone: collector.phone,
    role: "collector",
    exp: Date.now() + 1000 * 60 * 60 * 24 * 30,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", authSecret()).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyCollectorToken(token: string): { collectorId: string; phone: string } | null {
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;

  const expected = createHmac("sha256", authSecret()).update(data).digest("base64url");
  if (expected !== sig) return null;

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as {
      collectorId: string;
      phone: string;
      role: string;
      exp: number;
    };
    if (payload.role !== "collector" || !payload.collectorId || Date.now() > payload.exp) {
      return null;
    }
    return { collectorId: payload.collectorId, phone: payload.phone };
  } catch {
    return null;
  }
}
