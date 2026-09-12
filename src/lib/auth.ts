export function isAdminAuthorized(request: Request): boolean {
  const adminKey = process.env.ADMIN_KEY;

  if (!adminKey) {
    return process.env.NODE_ENV !== "production";
  }

  const auth = request.headers.get("authorization");
  return auth === `Bearer ${adminKey}`;
}
