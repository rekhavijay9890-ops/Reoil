"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Pickup = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: string;
  quantity: string;
  notes: string;
  receivedAt: string;
};

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadPickups = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/pickup", {
        headers: { Authorization: `Bearer ${adminKey}` },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          res.status === 401
            ? "Invalid admin key"
            : data.error ?? "Failed to load pickups",
        );
      }
      setPickups(data.pickups);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load pickups");
      setPickups([]);
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-reoil-dark">Pickup requests</h1>
      <p className="mt-2 text-muted-foreground">
        Admin dashboard — view all customer oil pickup bookings. No customer login required.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Admin access</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="admin-key">Admin key</Label>
            <Input
              id="admin-key"
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Set ADMIN_KEY in .env"
            />
          </div>
          <Button onClick={loadPickups} disabled={loading || !adminKey}>
            {loading ? "Loading…" : "Load pickups"}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <p className="mt-4 text-sm text-destructive" role="alert">{error}</p>
      )}

      {pickups.length > 0 && (
        <div className="mt-8 space-y-4">
          <p className="text-sm text-muted-foreground">{pickups.length} request(s)</p>
          {pickups.map((pickup) => (
            <Card key={pickup.id}>
              <CardContent className="grid gap-2 pt-6 sm:grid-cols-2">
                <p><strong>Name:</strong> {pickup.name}</p>
                <p><strong>Phone:</strong> {pickup.phone}</p>
                <p><strong>Email:</strong> {pickup.email}</p>
                <p><strong>Type:</strong> {pickup.type}</p>
                <p><strong>Quantity:</strong> {pickup.quantity}</p>
                <p><strong>Submitted:</strong> {new Date(pickup.receivedAt).toLocaleString()}</p>
                <p className="sm:col-span-2"><strong>Address:</strong> {pickup.address}</p>
                {pickup.notes && (
                  <p className="sm:col-span-2"><strong>Notes:</strong> {pickup.notes}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && pickups.length === 0 && adminKey && !error && (
        <p className="mt-8 text-muted-foreground">No pickups yet. Click Load pickups.</p>
      )}
    </section>
  );
}
