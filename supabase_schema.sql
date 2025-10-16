-- Create profiles table (id = auth.users.id)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  credits integer not null default 5,
  plan text not null default 'free',
  created_at timestamptz default now()
);

-- Prompt history
create table if not exists public.prompt_history (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  prompt text,
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.prompt_history enable row level security;

-- Policies
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='read own profile'
  ) then
    create policy "read own profile" on public.profiles
      for select using ( auth.uid() = id );
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='update own profile (no credits change)'
  ) then
    create policy "update own profile (no credits change)" on public.profiles
      for update using ( auth.uid() = id )
      with check ( auth.uid() = id );
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='prompt_history' and policyname='read own history'
  ) then
    create policy "read own history" on public.prompt_history
      for select using ( auth.uid() = user_id );
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='prompt_history' and policyname='insert own history'
  ) then
    create policy "insert own history" on public.prompt_history
      for insert with check ( auth.uid() = user_id );
  end if;
end $$;

-- RPC: atomically use one credit; returns true if deducted, false otherwise
create or replace function public.use_credit(user_id_param uuid)
returns boolean
language plpgsql
security definer
as $$
declare
  current_credits integer;
begin
  select credits into current_credits
  from public.profiles
  where id = user_id_param
  for update;

  if current_credits is null then
    insert into public.profiles (id, credits, plan) values (user_id_param, 4, 'free');
    return true;
  elsif current_credits > 0 then
    update public.profiles set credits = credits - 1 where id = user_id_param;
    return true;
  else
    return false;
  end if;
end;
$$;

-- RPC: grant credits (used by webhook)
create or replace function public.grant_credits(user_id_param uuid, amount_param integer)
returns void
language sql
security definer
as $$
  update public.profiles
  set credits = coalesce(credits, 0) + amount_param
  where id = user_id_param;
$$;

-- Trigger: auto-create profile on new auth user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, credits, plan)
  values (new.id, 5, 'free')
  on conflict (id) do nothing;
  return new;
end;
$$;

do $$ begin
  if not exists (
    select 1 from pg_trigger where tgname = 'on_auth_user_created'
  ) then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute function public.handle_new_user();
  end if;
end $$;
