"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUSES = [
  "pending",
  "confirmed",
  "assigned",
  "on_the_way",
  "collected",
  "completed",
  "cancelled",
] as const;

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
  status: string;
  preferredDate?: string;
  preferredTime?: string;
  litersEstimated: number;
  earningsInr: number;
  profileId?: string;
  proposedRatePerLitre?: number;
  agreedRatePerLitre?: number;
  negotiable?: boolean;
};

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadPickups = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/pickup", {
        headers: { Authorization: `Bearer ${adminKey}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(res.status === 401 ? "Invalid admin key" : data.error ?? "Failed to load");
      }
      setPickups(data.pickups);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load pickups");
      setPickups([]);
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  async function updatePickup(id: string, updates: Partial<Pickup>) {
    setSavingId(id);
    setError("");
    try {
      const res = await fetch(`/api/pickup/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${adminKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: updates.status,
          earningsInr: updates.earningsInr,
          litersEstimated: updates.litersEstimated,
          agreedRatePerLitre: updates.agreedRatePerLitre,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Update failed");
      setPickups((prev) => prev.map((p) => (p.id === id ? { ...p, ...data.pickup } : p)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSavingId(null);
    }
  }

  const pending = pickups.filter((p) => p.status === "pending").length;
  const completed = pickups.filter((p) => p.status === "completed").length;
  const totalLiters = pickups
    .filter((p) => p.status === "completed")
    .reduce((s, p) => s + (p.litersEstimated || 0), 0);

  const filtered =
    statusFilter === "all" ? pickups : pickups.filter((p) => p.status === statusFilter);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-reoil-dark">Admin dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Manage pickup requests — update status, set earnings, track operations.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="font-heading">Admin access</CardTitle>
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

      {pickups.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold">{pickups.length}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-amber-600">{pending}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Liters collected</p><p className="text-2xl font-bold text-reoil">{totalLiters} L</p></CardContent></Card>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-destructive" role="alert">{error}</p>}

      {pickups.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {["all", ...STATUSES].map((s) => (
            <Button
              key={s}
              size="sm"
              variant={statusFilter === s ? "default" : "outline"}
              onClick={() => setStatusFilter(s)}
            >
              {s === "all" ? "All" : s.replace(/_/g, " ")}
            </Button>
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="mt-8 space-y-4">
          {filtered.map((pickup) => (
            <Card key={pickup.id}>
              <CardContent className="grid gap-4 pt-6 lg:grid-cols-2">
                <div className="space-y-1 text-sm">
                  <p><strong>{pickup.name}</strong> · {pickup.phone}</p>
                  <p>{pickup.email}</p>
                  <p>{pickup.type} · {pickup.quantity}</p>
                  <p>{pickup.address}</p>
                  {pickup.preferredDate && (
                    <p>Preferred: {pickup.preferredDate} {pickup.preferredTime}</p>
                  )}
                  {pickup.notes && <p className="text-muted-foreground">Notes: {pickup.notes}</p>}
                  {pickup.negotiable && (
                    <p className="text-amber-700">
                      Negotiable · proposed ₹{pickup.proposedRatePerLitre ?? "—"}/L
                      {pickup.agreedRatePerLitre != null && ` · agreed ₹${pickup.agreedRatePerLitre}/L`}
                    </p>
                  )}
                  <p className="text-muted-foreground">
                    Submitted {new Date(pickup.receivedAt).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={pickup.status}
                      onValueChange={(value) => {
                        if (value) updatePickup(pickup.id, { ...pickup, status: value });
                      }}
                      disabled={savingId === pickup.id}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Liters</Label>
                      <Input
                        type="number"
                        value={pickup.litersEstimated}
                        onChange={(e) =>
                          setPickups((prev) =>
                            prev.map((p) =>
                              p.id === pickup.id
                                ? { ...p, litersEstimated: Number(e.target.value) }
                                : p,
                            ),
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Earnings ₹</Label>
                      <Input
                        type="number"
                        value={pickup.earningsInr}
                        onChange={(e) =>
                          setPickups((prev) =>
                            prev.map((p) =>
                              p.id === pickup.id
                                ? { ...p, earningsInr: Number(e.target.value) }
                                : p,
                            ),
                          )
                        }
                      />
                    </div>
                  </div>
                  {pickup.negotiable && (
                    <div className="space-y-2">
                      <Label>Agreed rate ₹/L</Label>
                      <Input
                        type="number"
                        step="0.5"
                        value={pickup.agreedRatePerLitre ?? pickup.proposedRatePerLitre ?? ""}
                        onChange={(e) =>
                          setPickups((prev) =>
                            prev.map((p) =>
                              p.id === pickup.id
                                ? { ...p, agreedRatePerLitre: Number(e.target.value) }
                                : p,
                            ),
                          )
                        }
                      />
                    </div>
                  )}
                  <Button
                    size="sm"
                    disabled={savingId === pickup.id}
                    onClick={() =>
                      updatePickup(pickup.id, {
                        status: pickup.status,
                        litersEstimated: pickup.litersEstimated,
                        earningsInr: pickup.earningsInr,
                        agreedRatePerLitre: pickup.agreedRatePerLitre,
                      })
                    }
                  >
                    {savingId === pickup.id ? "Saving…" : "Save changes"}
                  </Button>
                  {pickup.status === "completed" && (
                    <p className="text-xs text-muted-foreground">
                      Completed pickups appear in customer earnings.
                    </p>
                  )}
                </div>
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
