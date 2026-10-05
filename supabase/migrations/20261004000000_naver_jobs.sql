alter table public.diagnoses drop constraint if exists diagnoses_status_check;
alter table public.diagnoses add constraint diagnoses_status_check check (status in ('uploading','ready','processing','complete','failed','collecting'));
alter table public.diagnoses add column if not exists collected_items jsonb;
alter table public.diagnoses add column if not exists collect_attempts integer not null default 0;
alter table public.diagnoses add column if not exists collect_lease uuid;
alter table public.diagnoses add column if not exists collect_lease_until timestamptz;
alter table public.diagnoses add column if not exists collect_deadline timestamptz;
alter table public.diagnoses add column if not exists processing_started_at timestamptz;

create or replace function public.claim_naver_diagnosis()
returns table (id uuid, product_url text, lease uuid) language plpgsql security definer set search_path = public as $$
declare job public.diagnoses%rowtype;
begin
  select * into job from public.diagnoses d
  where d.status = 'collecting' and d.collected_items is null
    and d.collect_deadline > now() and d.collect_attempts < 3
    and (d.collect_lease_until is null or d.collect_lease_until < now())
  order by d.created_at for update skip locked limit 1;
  if not found then return; end if;
  update public.diagnoses d set collect_attempts = d.collect_attempts + 1,
    collect_lease = gen_random_uuid(), collect_lease_until = now() + interval '3 minutes'
    where d.id = job.id
    returning d.id, d.product_url, d.collect_lease into id, product_url, lease;
  return next;
end $$;
revoke all on function public.claim_naver_diagnosis() from public, anon, authenticated;
grant execute on function public.claim_naver_diagnosis() to service_role;

create table if not exists public.naver_worker_state (
  worker_id text primary key,
  last_seen_at timestamptz not null
);
alter table public.naver_worker_state enable row level security;
