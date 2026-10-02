# Supabase setup

1. Apply the migrations in order, including `migrations/20260929000000_keep_diagnoses.sql`. Existing and future diagnoses, emails, reports, and uploaded images then have no automatic expiration.
2. Deploy `functions/purge-expired-diagnoses` with `CLEANUP_SECRET` set as a function secret. The included function config disables JWT verification because the cron job uses this separate secret.
3. In Supabase Cron, schedule the function once daily with the `x-cleanup-secret` header. Despite its legacy name, it now only removes old daily-limit email entries.

The `diagnosis-inputs` bucket is private. Do not add public read policies; the application issues short-lived upload URLs from its server role.
