alter table public.diagnoses add column if not exists email_sending_at timestamptz;

comment on column public.diagnoses.email_sending_at is 'SMTP send lock. Keep when acceptance is uncertain to prevent duplicate sends until an operator checks Gmail Sent.';
