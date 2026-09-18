import { createClient } from "npm:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } },
);

Deno.serve(async (request) => {
  if (request.headers.get("x-cleanup-secret") !== Deno.env.get("CLEANUP_SECRET")) return new Response("Unauthorized", { status: 401 });
  const { data: expired, error } = await supabase.from("diagnoses").select("id,input_paths").lt("expires_at", new Date().toISOString()).limit(1000);
  if (error) return new Response("Cleanup failed", { status: 500 });
  for (const diagnosis of expired ?? []) {
    const paths = Array.isArray(diagnosis.input_paths) ? diagnosis.input_paths : [];
    if (paths.length) {
      const { error: removeError } = await supabase.storage.from("diagnosis-inputs").remove(paths);
      if (removeError) continue;
    }
    await supabase.from("diagnoses").delete().eq("id", diagnosis.id);
  }
  await supabase.from("diagnosis_daily_limits").delete().lt("day", new Date(Date.now() - 2 * 86_400_000).toISOString().slice(0, 10));
  return Response.json({ deleted: expired?.length ?? 0 });
});
