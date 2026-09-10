-- Nástěnka DEK Academy — tabulka a pravidla.
-- Vlož celé do Supabase → SQL Editor → New query → Run.

create table if not exists zpravy (
  id     uuid        primary key default gen_random_uuid(),
  vlakno uuid        references zpravy (id) on delete cascade,
  jmeno  text        not null,
  text   text        not null,
  lekce  text,
  cas    timestamptz not null default now()
);

create index if not exists zpravy_cas on zpravy (cas);

alter table zpravy enable row level security;

-- Číst smí kdokoli, kdo zná adresu. Nástěnka je interní, ne tajná.
drop policy if exists "kdokoli cte" on zpravy;
create policy "kdokoli cte" on zpravy
  for select to anon using (true);

-- Přidávat taky — ale jen pod jedním z deseti jmen a s rozumnou délkou.
-- Tím se z veřejného klíče nestane díra: cizí robot nemá co napsat.
drop policy if exists "kdokoli pridava" on zpravy;
create policy "kdokoli pridava" on zpravy
  for insert to anon with check (
    char_length(text) between 1 and 2000
    and char_length(coalesce(lekce, '')) <= 120
    and jmeno in ('Darina','Michal','Martin','Barbora','Vít','Tomáš','Svitlana','Jana','Kateřina','Marie')
  );

-- Mazat ani přepisovat nesmí nikdo. Chybí schválně: co není povolené,
-- je při zapnutém RLS zakázané.
