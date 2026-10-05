alter table public.diagnoses
  add column if not exists email_id text,
  add column if not exists email_sent_at timestamptz,
  add column if not exists email_error text;

comment on column public.diagnoses.email_sent_at is 'Time the email provider accepted the result email; not an inbox delivery confirmation.';
