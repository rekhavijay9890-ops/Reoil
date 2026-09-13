import { getSupabase, isSupabaseConfigured } from "./supabase";

export async function savePushToken(
  profileId: string,
  token: string,
  platform: string = "android",
) {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabase();
  const { error } = await supabase.from("push_tokens").upsert(
    {
      profile_id: profileId,
      token,
      platform,
    },
    { onConflict: "profile_id,token" },
  );
  if (error) throw new Error(error.message);
}

export async function listPushTokens(profileId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("push_tokens")
    .select("token")
    .eq("profile_id", profileId);
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => row.token as string);
}
