-- PROPOSED ONLY. Do not run until the live enquiry backend is reconciled and reviewed.
-- This is not applied to Supabase by this branch. Migration filename/version is assigned
-- using the Supabase CLI when promoting to a deployment change.
-- No child names, diagnoses, therapy notes, phone numbers, emails or other PII.
-- Growth OS owner access remains restricted by existing owner-only policies.
-- A composite unique index is required for the organisation-safe foreign key.
create unique index if not exists growth_workspace_id_org_key
  on public.growth_workspaces(id, organisation_id);

create table if not exists public.growth_leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.growth_workspaces(id) on delete cascade,
  organisation_id uuid not null,
  external_ref text,
  source text not null default 'unknown'
    check (source in ('organic_search', 'google_business_profile', 'instagram', 'direct', 'referral', 'unknown')),
  channel text not null
    check (channel in ('website_saved', 'staff_confirmed_whatsapp', 'staff_confirmed_call', 'staff_confirmed_other')),
  stage text not null default 'new'
    check (stage in ('new', 'contacted', 'assessment_booked', 'assessment_completed', 'enrolled', 'closed')),
  landing_path text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  received_at timestamptz not null default now(),
  first_contacted_at timestamptz,
  assessment_booked_at timestamptz,
  assessment_completed_at timestamptz,
  enrolled_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint growth_leads_org_consistent foreign key (workspace_id, organisation_id)
    references public.growth_workspaces(id, organisation_id),
  constraint growth_leads_external_unique unique (workspace_id, external_ref)
);
create index if not exists growth_leads_workspace_received
  on public.growth_leads(workspace_id, received_at desc);
create index if not exists growth_leads_workspace_stage
  on public.growth_leads(workspace_id, stage);
alter table public.growth_leads enable row level security;
revoke all on table public.growth_leads from anon, authenticated;
grant select, insert, update on table public.growth_leads to authenticated;
-- Matches current Growth OS owner-only access model; replace with proper
-- organisation-scoped permissions before expanding to other staff or tenants.
create policy growth_leads_owner_read on public.growth_leads
  for select to authenticated
  using ((select auth.uid()) = '66f9f28c-208b-44ad-872d-9be6d3551d06'::uuid);
create policy growth_leads_owner_insert on public.growth_leads
  for insert to authenticated
  with check ((select auth.uid()) = '66f9f28c-208b-44ad-872d-9be6d3551d06'::uuid);
create policy growth_leads_owner_update on public.growth_leads
  for update to authenticated
  using ((select auth.uid()) = '66f9f28c-208b-44ad-872d-9be6d3551d06'::uuid)
  with check ((select auth.uid()) = '66f9f28c-208b-44ad-872d-9be6d3551d06'::uuid);
-- Never expose an anonymous browser INSERT policy. Public enquiries should be
-- accepted by a rate-limited, validated server endpoint and inserted only after
-- successful durable storage; a drafted WhatsApp message is not an enquiry.
