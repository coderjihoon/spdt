alter table public.diagnoses alter column expires_at drop default;
alter table public.diagnoses alter column expires_at drop not null;
update public.diagnoses set expires_at = null where expires_at is not null;
