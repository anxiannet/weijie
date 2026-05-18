do $$ begin
  create type public.people_request_mode as enum ('buddy', 'service');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.people_budget_type as enum ('aa', 'treat', 'fixed', 'negotiable');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.people_request_status as enum ('open', 'matched', 'closed', 'expired');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.expert_price_type as enum ('hourly', 'fixed', 'negotiable');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.expert_service_status as enum ('active', 'inactive', 'pending_review', 'rejected');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.match_status as enum ('suggested', 'applied', 'accepted', 'rejected', 'cancelled');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 60),
  avatar_url text,
  gender text,
  age_range text,
  languages text[] not null default '{}',
  location_area text,
  bio text,
  is_verified boolean not null default false,
  rating_avg numeric(3,2) not null default 0 check (rating_avg >= 0 and rating_avg <= 5),
  rating_count integer not null default 0 check (rating_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.people_requests (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id) on delete cascade,
  mode public.people_request_mode not null,
  category text not null,
  title text not null check (char_length(title) between 4 and 120),
  description text not null check (char_length(description) between 10 and 4000),
  location_area text,
  specific_location text,
  start_time timestamptz,
  end_time timestamptz,
  budget_type public.people_budget_type not null default 'negotiable',
  budget_amount integer check (budget_amount is null or budget_amount > 0),
  desired_count integer not null default 1 check (desired_count > 0 and desired_count <= 20),
  requirements text,
  status public.people_request_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.expert_services (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.profiles(id) on delete cascade,
  category text not null,
  title text not null check (char_length(title) between 4 and 120),
  description text not null check (char_length(description) between 10 and 4000),
  price_type public.expert_price_type not null default 'negotiable',
  price_amount integer check (price_amount is null or price_amount > 0),
  service_area text,
  available_times text[] not null default '{}',
  tags text[] not null default '{}',
  proof_images text[] not null default '{}',
  status public.expert_service_status not null default 'pending_review',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.people_requests(id) on delete cascade,
  matched_user_id uuid not null references public.profiles(id) on delete cascade,
  match_score integer not null default 0 check (match_score >= 0 and match_score <= 100),
  status public.match_status not null default 'suggested',
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (request_id, matched_user_id)
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.people_requests(id) on delete cascade,
  user_a_id uuid not null references public.profiles(id) on delete cascade,
  user_b_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (user_a_id <> user_b_id)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  target_user_id uuid not null references public.profiles(id) on delete cascade,
  request_id uuid references public.people_requests(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  content text,
  created_at timestamptz not null default now(),
  unique (reviewer_id, target_user_id, request_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  target_type text not null,
  target_id uuid not null,
  reason text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create index if not exists user_profiles_user_idx on public.user_profiles(user_id);
create index if not exists people_requests_mode_status_created_idx on public.people_requests(mode, status, created_at desc);
create index if not exists people_requests_category_area_idx on public.people_requests(category, location_area);
create index if not exists expert_services_status_category_idx on public.expert_services(status, category);
create index if not exists matches_request_score_idx on public.matches(request_id, match_score desc);
create index if not exists conversations_request_users_idx on public.conversations(request_id, user_a_id, user_b_id);
create index if not exists reports_status_created_idx on public.reports(status, created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_profiles_touch_updated_at on public.user_profiles;
create trigger user_profiles_touch_updated_at before update on public.user_profiles for each row execute function public.touch_updated_at();

drop trigger if exists people_requests_touch_updated_at on public.people_requests;
create trigger people_requests_touch_updated_at before update on public.people_requests for each row execute function public.touch_updated_at();

drop trigger if exists expert_services_touch_updated_at on public.expert_services;
create trigger expert_services_touch_updated_at before update on public.expert_services for each row execute function public.touch_updated_at();

drop trigger if exists matches_touch_updated_at on public.matches;
create trigger matches_touch_updated_at before update on public.matches for each row execute function public.touch_updated_at();

drop trigger if exists conversations_touch_updated_at on public.conversations;
create trigger conversations_touch_updated_at before update on public.conversations for each row execute function public.touch_updated_at();

alter table public.user_profiles enable row level security;
alter table public.people_requests enable row level security;
alter table public.expert_services enable row level security;
alter table public.matches enable row level security;
alter table public.conversations enable row level security;
alter table public.reviews enable row level security;
alter table public.reports enable row level security;

drop policy if exists "User profiles are readable" on public.user_profiles;
create policy "User profiles are readable" on public.user_profiles for select using (true);

drop policy if exists "Users create own user profile" on public.user_profiles;
create policy "Users create own user profile" on public.user_profiles for insert with check (auth.uid() = user_id);

drop policy if exists "Users update own user profile" on public.user_profiles;
create policy "Users update own user profile" on public.user_profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Open people requests are readable" on public.people_requests;
create policy "Open people requests are readable" on public.people_requests for select using (status = 'open' or creator_id = auth.uid());

drop policy if exists "Users create own people requests" on public.people_requests;
create policy "Users create own people requests" on public.people_requests for insert with check (auth.uid() = creator_id);

drop policy if exists "Users update own people requests" on public.people_requests;
create policy "Users update own people requests" on public.people_requests for update using (auth.uid() = creator_id) with check (auth.uid() = creator_id);

drop policy if exists "Active expert services are readable" on public.expert_services;
create policy "Active expert services are readable" on public.expert_services for select using (status = 'active' or provider_id = auth.uid());

drop policy if exists "Users create own expert services" on public.expert_services;
create policy "Users create own expert services" on public.expert_services for insert with check (auth.uid() = provider_id);

drop policy if exists "Users update own expert services" on public.expert_services;
create policy "Users update own expert services" on public.expert_services for update using (auth.uid() = provider_id) with check (auth.uid() = provider_id);

drop policy if exists "Request participants read matches" on public.matches;
create policy "Request participants read matches" on public.matches for select using (
  matched_user_id = auth.uid() or exists (
    select 1 from public.people_requests
    where people_requests.id = matches.request_id
    and people_requests.creator_id = auth.uid()
  )
);

drop policy if exists "Users create own match applications" on public.matches;
create policy "Users create own match applications" on public.matches for insert with check (auth.uid() = matched_user_id);

drop policy if exists "Users update own match applications" on public.matches;
create policy "Users update own match applications" on public.matches for update using (
  matched_user_id = auth.uid() or exists (
    select 1 from public.people_requests
    where people_requests.id = matches.request_id
    and people_requests.creator_id = auth.uid()
  )
) with check (
  matched_user_id = auth.uid() or exists (
    select 1 from public.people_requests
    where people_requests.id = matches.request_id
    and people_requests.creator_id = auth.uid()
  )
);

drop policy if exists "Conversation participants are readable" on public.conversations;
create policy "Conversation participants are readable" on public.conversations for select using (auth.uid() in (user_a_id, user_b_id));

drop policy if exists "Conversation participants create own conversations" on public.conversations;
create policy "Conversation participants create own conversations" on public.conversations for insert with check (auth.uid() in (user_a_id, user_b_id));

drop policy if exists "Reviews are readable" on public.reviews;
create policy "Reviews are readable" on public.reviews for select using (true);

drop policy if exists "Users create own reviews" on public.reviews;
create policy "Users create own reviews" on public.reviews for insert with check (auth.uid() = reviewer_id);

drop policy if exists "Users create own reports" on public.reports;
create policy "Users create own reports" on public.reports for insert with check (auth.uid() = reporter_id);
