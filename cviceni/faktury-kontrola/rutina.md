# Naplánovaná úloha: ranní kontrola faktur

Co vyplnit v aplikaci Claude → záložka **Code** → **Routines** → **New routine** → **Local**.
Local, ne Cloud: cloudová varianta nevidí složku na tvém disku.

## Formulář

| Pole | Co vyplnit |
| --- | --- |
| **Name** | `kontrola-faktur` |
| **Description** | Ranní kontrola nových faktur a mail s výsledkem |
| **Model** | Sonnet — na tuhle práci stačí a je nejúspornější |
| **Permission mode** | Accept edits — jinak se běh zastaví na dotazu, na který v sedm ráno nikdo neodpoví |
| **Folder** | složka tohoto projektu (`faktury-kontrola`) |
| **Schedule** | Daily, 7:00 |

## Instructions

```
Postupuj podle skillu kontrola-faktur.

Kdyby bylo po poledni, znamená to, že běh je dohnaný ze zameškaného rána —
i tak ho normálně dokonči, jen do protokolu napiš, kdy doopravdy běžel.

Když ve vstup/ nepřibyla žádná nová faktura, nic nedělej a nic neposílej.

Když jsi hotový a v protokolu je aspoň jeden nález, otevři mi rozepsaný
e-mail příkazem níže. Do těla dej shrnutí z protokolu, ne celou tabulku.
Nic neodesílej — jenom otevři okno, odeslání zůstává na mně.

open "mailto:ucetni@dek.cz?subject=Kontrola%20faktur%20<DATUM>&body=<SHRNUTI>"

Když je nesouladů víc než tři, mail neotvírej a napiš mi to do protokolu.
```

## Než to necháš běžet samo

1. Po uložení klikni na **Run now** a projdi si, na co se to zeptá — u každého
   dotazu vyber „always allow“. Další běhy se pak už neptají.
2. Zkontroluj, co vzniklo ve `vystup/`.
3. Teprve pak to nech na ránu.

## Co je dobré vědět

- Místní úloha běží, jen když je aplikace Claude spuštěná a počítač vzhůru.
  Když počítač v sedm spí, běh se přeskočí.
- Po probuzení nebo startu aplikace se **jeden** zameškaný běh dožene — ten
  poslední. Když byl počítač vypnutý týden, nespustí se sedm běhů, ale jeden.
  Proto je v instrukcích ta věta o poledni.
- Když chceš, aby to běželo i s vypnutým počítačem, není to tenhle typ úlohy.
  To už musí běžet někde jinde než na tvém stole.

## Kam sáhnout, když se něco pokazí

Runbook je v `runbook.md` vedle tohoto souboru.
