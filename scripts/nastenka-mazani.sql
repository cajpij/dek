-- Nástěnka DEK Academy — mazání vlastních zpráv.
-- Navazuje na nastenka.sql. Vlož celé do Supabase → SQL Editor → New query → Run.
--
-- Myšlenka: nástěnka nikoho nepřihlašuje, takže „jsem Martin" není důkaz —
-- jméno si vybere z nabídky kdokoli. Důkazem je tajemství, které vyrobí
-- prohlížeč při odeslání zprávy: uloží se k řádku i do localStorage. Číst
-- se ten sloupec nedá a smazat řádek jde jen s hlavičkou X-Tajemstvi, která
-- sedí. Cizí zprávu proto nesmaže ani ten, kdo si veřejný klíč opíše ze
-- zdrojáku akademie.

alter table zpravy add column if not exists tajemstvi text;

-- Sloupcová práva: anon čte jen to, co se na nástěnce vypisuje. Bez tohohle
-- kroku by si tajemství kdokoli přečetl přes ?select=tajemstvi a celá
-- ochrana by byla na oko.
revoke select, insert on zpravy from anon;
revoke select, insert on zpravy from public;
grant select (id, vlakno, jmeno, text, lekce, cas) on zpravy to anon;
grant insert (id, vlakno, jmeno, text, lekce, tajemstvi) on zpravy to anon;
grant delete on zpravy to anon;

-- Vlastní pravidlo mazání. `using` se vyhodnotí pro každý řádek zvlášť,
-- takže i kdyby někdo poslal DELETE bez filtru, projde jen ten jeho.
create policy "smaze jen svoje" on zpravy
  for delete to anon using (
    tajemstvi is not null
    and tajemstvi = current_setting('request.headers', true)::json ->> 'x-tajemstvi'
  );

-- Přepisovat pořád nesmí nikdo — pravidlo pro update tu schválně není.
--
-- Zprávy napsané dřív než tenhle skript mají tajemstvi prázdné a smazat je
-- odsud nejde. Když je chceš pryč, smaž je ručně v Supabase → Table editor.
