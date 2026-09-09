# Naplánovaná automatizace: kontrola nových faktur v Outlooku

Co vyplnit v aplikaci Claude → záložka **Code** → **Routines** → **New routine**.

## Než založíš automatizaci: konektor na Microsoft 365

Tahle automatizace potřebuje konektor Claude na Microsoft 365 se zapnutými
**write tools** (posílání pošty) — bez nich přečte schránku, ale e-mail
neodešle,
jenom ho navrhne (viz `CLAUDE.md`, „Když projekt běží bez připojené
schránky"). Write tools zapíná zvlášť správce Microsoft 365, přihlášený
pracovním účtem; osobní outlook.com nebo hotmail.com nefunguje. Text, který
mu poslat, je níž v „Co napsat správci".

## Formulář

| Pole | Co vyplnit |
| --- | --- |
| **Name** | `kontrola-faktur` |
| **Description** | Sleduje schránku a doplňuje chybějící údaje na fakturách |
| **Model** | Sonnet — na tuhle práci stačí a je nejúspornější |
| **Permission mode** | Accept edits — jinak se běh zastaví na dotazu, na který nikdo neodpoví |
| **Folder** | složka tohoto projektu (`faktury-kontrola`) |
| **Schedule** | Every 15 minutes, v pracovní dny 7:00–18:00 |

Proč každých 15 minut, ne jednou denně: tahle automatizace nahrazuje ruční
sledování schránky, takže žádost o doplnění má dodavateli přijít brzy po
faktuře, ne až druhý den. Claude Code nemá skutečné „hned jak přijde
e-mail" spouštění — nejblíž tomu je časté opakování. Když ti 15 minut
připadá zbytečně husté, dej to na 30 nebo na hodinu; nic se tím nerozbije,
jen se prodlouží čas do odpovědi dodavateli.

## Instructions

```
Postupuj podle skillu kontrola-faktur.

Zkontroluj schránku fakturace@dek.cz na nové e-maily s PDF přílohou, které
ještě nejsou uložené ve vstup/. Když nic nového nepřišlo, nic nedělej a
nic neposílej.

Ke každé nové faktuře udělej celý postup ze skillu — uložení do vstup/,
vytažení šesti údajů, zápis do data/objednavky.xlsx do sešitu podle
dodavatele, a když něco chybí a je toho jeden nebo dva údaje, zapiš to do
vystup/kontrola-<dnešní datum>.xlsx i s navrženým textem a ten text pošli
dodavateli na adresu, ze které faktura přišla, v kopii
vedouci-uctarny@dek.cz. Čas odeslání zapiš do kontrola-<dnešní datum>.xlsx
i do sloupce „Žádost odeslána" v data/objednavky.xlsx.

Když u některé faktury chybí tři a víc údajů, nebo se PDF nedá přečíst,
nic neposílej — zapiš to do protokolu k ruční kontrole.

Nikdy neposílej nic, co se týká platby, schválení nebo účetnictví.
```

## Než to necháš běžet samo

1. Po uložení klikni na **Run now** a projdi si, na co se to zeptá — u
   každého dotazu vyber „always allow". Další běhy se pak už neptají.
2. Zkontroluj vystup/kontrola-<dnešní datum>.xlsx a fakticky i schránku
   Odeslaná pošta — porovnej, že text, který se poslal, je slovo od slova
   ten, co je v sešitu dodavatele.
3. Mrkni i do data/objednavky.xlsx: nová faktura má mít řádek v sešitu svého
   dodavatele a u té, které něco chybělo, má být vyplněný sloupec „Žádost
   odeslána".
4. Teprve pak to nech běžet samo. **První den to nech běžet vedle sebe a
   po každém běhu se podívej, co se stalo** — je to jediná automatizace
   v tomhle projektu, která bez tvého kliknutí posílá poštu ven z firmy.

## Co je dobré vědět

- Místní automatizace běží, jen když je aplikace Claude spuštěná a počítač
  vzhůru. Když počítač spí, běh se přeskočí a doženou se jen ty, co chyběly
  bezprostředně předtím — ne všechny za celou dobu.
- Kdyby konektor na M365 spadl nebo přišel o přístup, automatizace se
  zastaví na dotazu, ne že by tiše nic nedělala — sleduj to hlavně první týden.
- Když chceš, aby tohle běželo i s vypnutým počítačem, není to tenhle typ
  automatizace. To už musí běžet někde jinde než na tvém stole.

## Co napsat správci

```
Ahoj, potřeboval bych u konektoru Microsoft 365 pro Claude povolit
write tools (odesílání pošty) pro schránku fakturace@dek.cz.

K čemu to bude: automatická kontrola došlých faktur. Automatizace zkontroluje
šest povinných údajů a dodavateli automaticky pošle žádost o doplnění,
když jeden nebo dva chybí. Nic k platbě, schválení ani do účetnictví
se automaticky neposílá — to zůstává na nás.

Čtecí přístup už mám a funguje. Práva se dědí z účtu, takže Claude uvidí
přesně to, co já, nic navíc.
```

## Kam sáhnout, když se něco pokazí

Runbook je v `runbook.md` vedle tohoto souboru.
