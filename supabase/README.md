# Supabase setup

1. Apply `migrations/20260918_diagnoses.sql`.
2. Deploy `functions/purge-expired-diagnoses` with `CLEANUP_SECRET` set as a function secret. The included function config disables JWT verification because the cron job uses this separate secret.
3. In Supabase Cron, schedule the function once daily with the `x-cleanup-secret` header. The function removes expired private images before deleting the matching diagnosis rows.

The `diagnosis-inputs` bucket is private. Do not add public read policies; the application issues short-lived upload URLs from its server role.
