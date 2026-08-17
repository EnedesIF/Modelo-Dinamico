-- Modelo Dinâmico Educacional — esquema inicial para Supabase Postgres.
-- Cole todo este arquivo no SQL Editor de um projeto Supabase vazio e clique em Run.
-- Este script cria tabelas, índices e políticas; não inclui dados de teste nem credenciais.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text,
  role text not null default 'teacher' check (role in ('teacher', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_activities (
  id bigint generated always as identity primary key,
  key text not null unique,
  owner_id uuid references public.profiles(id) on delete set null,
  title text not null,
  guidelines text not null default '',
  contract jsonb not null default '{}'::jsonb,
  goals jsonb not null default '[]'::jsonb,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint learning_activities_goals_array check (jsonb_typeof(goals) = 'array')
);

create table if not exists public.student_groups (
  id bigint generated always as identity primary key,
  activity_id bigint not null references public.learning_activities(id) on delete cascade,
  name text not null check (char_length(name) between 3 and 120),
  access_code text not null unique check (char_length(access_code) between 8 and 24),
  status text not null default 'active' check (status in ('active', 'submitted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists student_groups_activity_idx
  on public.student_groups(activity_id);

create table if not exists public.group_members (
  id bigint generated always as identity primary key,
  group_id bigint not null references public.student_groups(id) on delete cascade,
  name text not null check (char_length(name) between 3 and 160),
  email text not null,
  phone text not null,
  is_coordinator boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists group_members_group_idx
  on public.group_members(group_id);

create table if not exists public.group_workspaces (
  id bigint generated always as identity primary key,
  group_id bigint not null unique references public.student_groups(id) on delete cascade,
  document jsonb not null default '{"metaPlans":[]}'::jsonb,
  metrics jsonb not null default '{}'::jsonb,
  progress integer not null default 0 check (progress between 0 and 100),
  quality_score integer not null default 0 check (quality_score between 0 and 100),
  quality_level text not null default 'Em construção',
  last_saved_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists group_workspaces_quality_idx
  on public.group_workspaces(quality_score);

alter table public.profiles enable row level security;
alter table public.learning_activities enable row level security;
alter table public.student_groups enable row level security;
alter table public.group_members enable row level security;
alter table public.group_workspaces enable row level security;

create policy "professor le o proprio perfil"
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy "professor atualiza o proprio perfil"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "professor administra a propria atividade"
on public.learning_activities
for all
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

-- Realtime será habilitado depois que a aplicação serverless estiver conectada.
-- alter publication supabase_realtime add table public.group_workspaces;
