# Runbook — kontrola faktur

Jedna stránka pro chvíli, kdy něco spadne a ty jsi na dovolené.

## Co to dělá

Každé ráno v 7:00 projde faktury v PDF ve složce `vstup/`, vytáhne z nich
povinné údaje, porovná je se seznamem schválených objednávek v
`data/objednavky.xlsx` a uloží do `vystup/` dva soubory: kontrolní tabulku
a protokol. Když je v protokolu nález, otevře rozepsaný e-mail.

**Neschvaluje faktury a nic neplatí.** Připravuje podklad, rozhoduje člověk.

## Kde to běží

Naplánovaná úloha `kontrola-faktur` v aplikaci Claude, záložka Code → Routines,
typ Local. Běží na počítači, na kterém je nastavená — ne v cloudu.

## Jak poznám, že to dopadlo

Otevři poslední `vystup/protokol-*.md`. První čtyři řádky stačí:

- **Zpracováno faktur** — kolik jich bylo. Když je tam 0 a ve `vstup/` něco je,
  úloha nová PDF nenašla; podívej se, jestli mají čitelný text.
- **Chybí povinný údaj** — faktura, ze které se nedal přečíst některý údaj.
- **Částka nesedí na objednávku** — tohle řeš první.
- **Objednávka není v seznamu schválených** — buď je v `data/objednavky.xlsx`
  starý export, nebo faktura odkazuje na něco, co nikdo neschválil.

## Když to spadne

| Co se stalo | Čím to bývá | Co s tím |
| --- | --- | --- |
| Úloha se ráno nespustila | počítač spal nebo byla zavřená aplikace | běh se dohoní po probuzení, jeden. Když to vadí, zapni v nastavení aplikace „Keep computer awake“. |
| Běh se zastavil na dotazu | úloha běží v režimu, který se ptá | otevři to sezení v postranním panelu, odpověz a u příště dej „always allow“ |
| U všech faktur „nenalezeno“ | starý nebo přejmenovaný `data/objednavky.xlsx` | dej tam nový export a pusť **Run now** |
| Protokol hlásí spoustu nesouladů | většinou se změnil vstup, ne že by bylo pět špatných faktur | nic nerozesílej, projdi dvě tři faktury ručně |
| Ve `vstup/` zmizel soubor | někdo tam uklidil | soubory ve `vstup/` maže jen člověk; úloha do té složky zapisovat nesmí (hlídá to hook) |

## Komu napsat

Nejdřív tomu, kdo tuhle úlohu nastavil. Když jde o obsah faktur, účetní.
Když jde o objednávky, ten, kdo je schvaluje.

## Co dělat, až tomu přeroste hlava

Pokud faktur bude denně desítky, přestane se vyplácet číst každou PDF znovu.
V tu chvíli si nech napsat malý skript, který vytáhne údaje, a Claudovi nech
jen posouzení nálezů. Do té doby to nech, jak to je — je to čitelnější.
