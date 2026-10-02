import { createClient } from "npm:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } },
);

Deno.serve(async (request) => {
  if (request.headers.get("x-cleanup-secret") !== Deno.env.get("CLEANUP_SECRET")) return new Response("Unauthorized", { status: 401 });
  const { error } = await supabase.from("diagnosis_daily_limits").delete().lt("day", new Date(Date.now() - 2 * 86_400_000).toISOString().slice(0, 10));
  if (error) return new Response("Cleanup failed", { status: 500 });
  return Response.json({ ok: true });
});
