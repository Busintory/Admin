create extension if not exists pgcrypto;

create table if not exists public.staff (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (length(trim(full_name)) > 0),
  role text not null check (role in ('super_admin', 'data_manager', 'data_entry')),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (length(trim(name)) > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (length(trim(name)) > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.forms (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (length(trim(name)) > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  local_name text,
  category_id uuid not null references public.categories(id) on delete restrict,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_brands (
  product_id uuid not null references public.products(id) on delete cascade,
  brand_id uuid not null references public.brands(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (product_id, brand_id)
);

create table if not exists public.product_forms (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  form_id uuid not null references public.forms(id) on delete restrict,
  size_label text,
  created_at timestamptz not null default now(),
  unique nulls not distinct (product_id, form_id, size_label)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create or replace function public.current_staff_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.staff where id = auth.uid()
$$;

create or replace function public.has_staff_role(min_role text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    case public.current_staff_role()
      when 'super_admin' then 3
      when 'data_manager' then 2
      when 'data_entry' then 1
      else 0
    end >= case min_role
      when 'super_admin' then 3
      when 'data_manager' then 2
      when 'data_entry' then 1
      else 999
    end,
    false
  )
$$;

alter table public.staff enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.forms enable row level security;
alter table public.products enable row level security;
alter table public.product_brands enable row level security;
alter table public.product_forms enable row level security;

create policy "staff can read self or super admins can read all"
on public.staff for select to authenticated
using (id = auth.uid() or public.has_staff_role('super_admin'));

create policy "super admins can insert staff"
on public.staff for insert to authenticated
with check (public.has_staff_role('super_admin'));

create policy "super admins can update other staff"
on public.staff for update to authenticated
using (public.has_staff_role('super_admin') and id <> auth.uid())
with check (public.has_staff_role('super_admin'));

create policy "super admins can delete other staff"
on public.staff for delete to authenticated
using (public.has_staff_role('super_admin') and id <> auth.uid());

create policy "staff can read categories"
on public.categories for select to authenticated
using (public.has_staff_role('data_entry'));

create policy "data managers can manage categories"
on public.categories for all to authenticated
using (public.has_staff_role('data_manager'))
with check (public.has_staff_role('data_manager'));

create policy "staff can read brands"
on public.brands for select to authenticated
using (public.has_staff_role('data_entry'));

create policy "staff can create brands"
on public.brands for insert to authenticated
with check (public.has_staff_role('data_entry'));

create policy "data managers can update brands"
on public.brands for update to authenticated
using (public.has_staff_role('data_manager'))
with check (public.has_staff_role('data_manager'));

create policy "data managers can delete brands"
on public.brands for delete to authenticated
using (public.has_staff_role('data_manager'));

create policy "staff can read forms"
on public.forms for select to authenticated
using (public.has_staff_role('data_entry'));

create policy "staff can create forms"
on public.forms for insert to authenticated
with check (public.has_staff_role('data_entry'));

create policy "data managers can update forms"
on public.forms for update to authenticated
using (public.has_staff_role('data_manager'))
with check (public.has_staff_role('data_manager'));

create policy "data managers can delete forms"
on public.forms for delete to authenticated
using (public.has_staff_role('data_manager'));

create policy "staff can read products"
on public.products for select to authenticated
using (public.has_staff_role('data_entry'));

create policy "staff can create products"
on public.products for insert to authenticated
with check (public.has_staff_role('data_entry'));

create policy "staff can update products"
on public.products for update to authenticated
using (public.has_staff_role('data_entry'))
with check (public.has_staff_role('data_entry'));

create policy "data managers can delete products"
on public.products for delete to authenticated
using (public.has_staff_role('data_manager'));

create policy "staff can read product brands"
on public.product_brands for select to authenticated
using (public.has_staff_role('data_entry'));

create policy "staff can manage product brands"
on public.product_brands for all to authenticated
using (public.has_staff_role('data_entry'))
with check (public.has_staff_role('data_entry'));

create policy "staff can read product forms"
on public.product_forms for select to authenticated
using (public.has_staff_role('data_entry'));

create policy "staff can manage product forms"
on public.product_forms for all to authenticated
using (public.has_staff_role('data_entry'))
with check (public.has_staff_role('data_entry'));
