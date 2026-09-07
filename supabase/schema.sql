-- Run this in the Supabase SQL editor to set up the articles table.

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  url text not null unique,
  source text not null,
  published_at timestamptz not null,
  severity text not null default 'info' check (severity in ('critical', 'high', 'info')),
  inserted_at timestamptz not null default now()
);

create index if not exists articles_published_at_idx on articles (published_at desc);
create index if not exists articles_source_idx on articles (source);

-- Allow public read access (no auth needed to read the feed)
alter table articles enable row level security;

create policy "Public read access"
  on articles for select
  using (true);

-- Inserts happen only via the ingestion script using the service role key,
-- which bypasses RLS, so no insert policy is needed for anon/public.
