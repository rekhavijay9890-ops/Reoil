import { getSupabase, isSupabaseConfigured } from "./supabase";

export type Address = {
  id: string;
  profileId: string;
  label: string;
  address: string;
  lat?: number;
  lng?: number;
  createdAt: string;
};

type AddressRow = {
  id: string;
  profile_id: string;
  label: string;
  address: string;
  lat: number | null;
  lng: number | null;
  created_at: string;
};

function rowToAddress(row: AddressRow): Address {
  return {
    id: row.id,
    profileId: row.profile_id,
    label: row.label,
    address: row.address,
    lat: row.lat ?? undefined,
    lng: row.lng ?? undefined,
    createdAt: row.created_at,
  };
}

export async function listAddresses(profileId: string): Promise<Address[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as AddressRow[]).map(rowToAddress);
}

export async function saveAddress(
  profileId: string,
  input: { label: string; address: string; lat?: number; lng?: number },
): Promise<Address> {
  if (!isSupabaseConfigured()) {
    throw new Error("Addresses require Supabase");
  }
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("addresses")
    .insert({
      profile_id: profileId,
      label: input.label,
      address: input.address,
      lat: input.lat ?? null,
      lng: input.lng ?? null,
    })
    .select()
    .single();
  if (error || !data) throw new Error(error?.message ?? "Failed to save address");
  return rowToAddress(data as AddressRow);
}

export async function deleteAddress(profileId: string, addressId: string) {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabase();
  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("profile_id", profileId);
  if (error) throw new Error(error.message);
}
