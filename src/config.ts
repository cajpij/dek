import type { RunConfig } from './types'

/**
 * Výchozí program — čtyřhodinový workshop DEK Academy, 16:00–20:00.
 *
 * Odpovídá 1:1 lekci „Jak workshop poběží“ v akademii
 * (/#academy/claude-a-firemni-data/program-dne). Když se změní tam, musí se
 * změnit i tady — jsou to dva pohledy na tentýž den, jeden pro účastníky
 * a jeden pro moderátora.
 *
 * Proč zrovna takhle:
 *
 *  - Nastavení složky a projektu je hned na začátku, ne doma. Kdyby se
 *    nechalo na účastnících, půlka to neudělá a zjistí se to ve chvíli,
 *    kdy má člověk stavět. Takhle se problém najde v 16:20 a je celý večer
 *    na to ho obejít. Skilly, hooky a běh bez dozoru zůstávají v samostudiu.
 *  - Celý den stojí na jednom vzoru: proces kontroly faktur z účtárny.
 *    Nejdřív se projde společně, pak ho každý postaví vlastníma rukama od
 *    prázdné složky — a teprve když ví, jak to vypadá hotové, jde hledat
 *    totéž ve vlastní práci. Vlastní agenda je proto až v poslední hodině.
 *  - Dva bloky jsou nedotknutelné — stavění složky a mapování ve dvojicích.
 *    Když se program rozjede, škrtá se všechno ostatní. Jsou to jediné části,
 *    kde lidem něco projde rukama.
 *  - Po stavění jde živá ukázka: naplánovaný běh za pět minut. Není to
 *    látka, je to důkaz, že těch pět schodů někam vede — a běží na pozadí,
 *    zatímco sál mapuje vlastní agendu.
 *  - Začíná se po pracovním dni, takže hned po úvodu je rozehřívačka: lidé
 *    se postaví, promluví a rozdělí se do dvojic napříč odděleními. Dvojice
 *    zůstávají na celé odpoledne — cizí člověk se ptá líp než kolega z týmu.
 *
 * Publikum jsou lidé z logistiky, autodopravy, BI, marketingu a vedení. Chtějí
 * Claude Code, ne Cowork, a neprogramují — všechno, co se v sále dělá, jsou
 * textové soubory a složky.
 *
 * Délky bloků se dají přepsat přímo v aplikaci (Nastavení a program → JSON)
 * a uloží se do prohlížeče; tenhle soubor je stav, ke kterému se lze vrátit.
 *
 * Seznam účastníků tu schválně není — jsou to údaje o konkrétních lidech
 * a repozitář je veřejný. Načítá se lokálně nebo ze zašifrovaného souboru,
 * viz README.
 */

/** Vzor, na kterém se ukazuje všechno ostatní. Opakuje se v několika blocích. */
const FAKTURY_BRIEF =
  'Faktura přijde e-mailem do sdílené schránky jako PDF. Marie z ní ručně přepíše šest údajů do ' +
  'kontrolní tabulky, dohledá odpovídající objednávku v exportu a porovná základ daně. Když nesedí, ' +
  'jde e-mail tam a zpět s dodavatelem nebo se střediskem. Když sedí, faktura jde e-mailem ke schválení ' +
  'vedoucímu střediska, schválení se ručně zapíše zpátky do tabulky a nakonec se zadá do účetního ' +
  'systému k platbě — ten poslední krok zůstává vždycky na člověku.'

export const DEFAULT_CONFIG: RunConfig = {
  event: {
    title: 'DEK Academy — workshop',
    date: 'doplnit datum',
    venue: 'Místo konání',
    startsAt: '16:00',
  },
  participants: [],
  agenda: [
    {
      title: 'Úvod: proč to děláme',
      min: 10,
      kind: 'talk',
      who: 'Martin',
      lessons: ['claude-a-firemni-data/program-dne', 'claude-a-firemni-data/co-je-automatizace'],
      steps: [
        { title: 'Co dnes vznikne', min: 3, detail: 'Složka, kterou si každý postaví sám, a k ní mapa vlastní práce', lessons: ['claude-a-firemni-data/co-je-automatizace'] },
        { title: 'Pět schodů automatizace', min: 5, detail: 'Zadání → pravidlo → skill → hook → běh bez tebe', lessons: ['od-mapy-k-automatu/jak-se-nastavuje-automatizace'] },
        { title: 'Co je předem hotové a co se dnes nestihne', min: 2 },
      ],
      notes: [
        'Ověřit, že mají všichni nainstalovaný Claude Code — instalace je jediná věc, která měla být předem',
        'Složku nastavujeme hned v dalším bloku, tady jen zjistit, kolik lidí ji nemá',
        'Ukázat schéma pěti schodů z akademie — v 17:45 se podle něj bude stavět',
        'Říct rovnou pořadí večera: nejdřív hotový vzor, pak si ho každý postaví sám, a teprve pak hledáme totéž ve vlastní práci',
        'Ukázat obrázek ručně vs. automat z lekce Co je automatizace — je to nejrychlejší způsob, jak říct, o čem večer je',
        'Odkaz na akademii nechat na plátně',
      ],
    },
    {
      title: 'Rozehřívačka: co jsem dneska dělal ručně',
      min: 10,
      kind: 'work',
      who: 'Martin',
      brief:
        'Postavte se. Najděte si dvojici z jiného oddělení, než jste vy — ne souseda, se kterým ' +
        'sedíte každý den. S tou dvojicí zůstanete celé odpoledne. Pak si každý dostane minutu ' +
        'na jednu věc, kterou dneska dělal ručně a štvalo ho to.',
      steps: [
        { title: 'Vstát a najít si dvojici z jiného oddělení', min: 2 },
        { title: 'Minuta na každého — co jsem dneska dělal ručně', min: 3 },
        { title: 'Kolečko: každá dvojice řekne jednu věc nahlas', min: 5 },
      ],
      examples: [
        { title: 'Něco, co jsem dneska přeťukával z jednoho okna do druhého' },
        { title: 'Něco, u čeho jsem čekal, až mi někdo odpoví' },
        { title: 'Něco, co jsem dělal potřetí tenhle týden' },
        { title: 'Něco, co bych nemohl nechat na kolegovi, protože to mám v hlavě' },
      ],
      notes: [
        'Je po pracovním dni — sál potřebuje vstát a promluvit dřív, než začne poslouchat',
        'Dvojice napříč odděleními jsou schválně: cizí člověk se ptá líp než kolega, který to zná',
        'Tyhle dvojice drží celé odpoledne, včetně rozhovorů v poslední hodině — říct to hned',
        'Nesbírat řešení, jen sbírat. Kdo začne radit, zarazit ho — přijde to za dvě hodiny.',
        'Držet minutu na člověka, jinak se z toho stane porada',
        'To, co v kolečku zazní, si zapsat — vrátíme se k tomu v rozhovorech ve dvojicích',
      ],
    },
    {
      title: 'Nastavení: sdílená složka a projekt',
      min: 30,
      lessons: ['claude-a-firemni-data/sdilena-slozka-sharepoint', 'claude-a-firemni-data/co-claude-ve-slozce-vidi', 'claude-a-firemni-data/projekt-v-claude-code'],
      kind: 'work',
      who: 'Lektor + asistence',
      brief:
        'Než začne kdokoli cokoli stavět, musí mít každý na disku složku se svými daty a v ní projekt. ' +
        'Je to jediná část večera, kde se něco nastavuje — a děláme ji na začátku schválně, ' +
        'aby se případný problém našel teď a ne ve chvíli, kdy má člověk stavět.',
      steps: [
        { title: 'Nasyncovat knihovnu ze SharePointu', min: 10, detail: 'Přidat zástupce do OneDrivu, počkat, až se stáhne', lessons: ['claude-a-firemni-data/sdilena-slozka-sharepoint'] },
        { title: 'Vždy ponechat v tomto zařízení a připojit složku v Claudovi', min: 5, detail: 'Bez toho jsou na disku jen zástupci a Claude nic nepřečte', lessons: ['claude-a-firemni-data/sdilena-slozka-sharepoint', 'claude-a-firemni-data/co-claude-ve-slozce-vidi'] },
        { title: 'Založit projekt: složka agendy, data/ a vystup/', min: 5, lessons: ['claude-a-firemni-data/projekt-v-claude-code'] },
        { title: 'Napsat CLAUDE.md', min: 10, detail: 'Pět řádků slovníku, kde jsou data, dvě pravidla co se nesmí', lessons: ['claude-a-firemni-data/projekt-v-claude-code'] },
      ],
      examples: [
        { title: 'Mám knihovnu nasyncovanou', detail: 'Rovnou zakládej projekt a piš CLAUDE.md. Zbyde ti čas, pomoz sousedovi.' },
        { title: 'Sync mi nejede', detail: 'Nezdržuj se tím. Vezmi kopii jednoho reálného souboru na disk a jeď na ní — dosyncuje se doma.' },
        { title: 'Nemám přístup do knihovny', detail: 'Totéž: lokální kopie stačí. Přístup vyřeš s IT po workshopu.' },
        { title: 'Nevím, jakou agendu si vybrat', detail: 'Tu, kterou jsi zmínil v rozehřívačce. Stačí výsek.' },
      ],
      notes: [
        'Tohle je jediný blok, kde se nastavuje — proto je na začátku, ne doma',
        'Na Macu je složka v ~/Library/CloudStorage, ve Windows pod profilem uživatele s ikonou budovy',
        'Hlídat ty, komu to nejede. Nikoho nenechat čekat na sync — lokální kopie je plnohodnotná náhrada.',
        'Kdo je hotový dřív, ať pomůže sousedovi. Rychle se pozná, kdo to má a kdo ne.',
        'Ukázat hotový CLAUDE.md kontroly faktur jako vzor, ať neopisují ze vzduchu',
        'Kdo má projekt v nasyncované knihovně, upozornit, že obsah uvidí celý tým',
        'Když někomu nepůjde ani lokální kopie, ať pracuje ve dvojici — večer nesmí propadnout na nastavování',
      ],
    },
    {
      title: 'Vzor: kontrola faktur ručně a co z ní zbude',
      min: 15,
      lessons: ['claude-a-firemni-data/co-je-automatizace'],
      kind: 'talk',
      who: 'Lektor',
      brief: FAKTURY_BRIEF,
      steps: [
        { title: 'Projít proces po krocích', min: 7, detail: 'Osm kroků od e-mailu s fakturou po zadání k platbě', lessons: ['claude-a-firemni-data/co-je-automatizace'] },
        { title: 'Ukázat obrázek ručně vs. automat', min: 5, detail: 'Nad řezem to, co dělá počítač, pod ním člověk — nechat sál hádat, kudy ten řez vede' },
        { title: 'Co má zůstat člověku', min: 3, detail: 'Schválení faktury k platbě — i sedící čísla nemusí znamenat zaplať' },
      ],
      notes: [
        'Tohle je jediný blok, kde se hodně mluví. Držet ho.',
        'Nechat sál hádat, kde se přepisuje — nejde o to říct jim to, jde o to, aby si toho všimli',
        'Zmínit, že jeden krok už dnes běží s Claudem (Kontrola faktur), takže to není od nuly',
        'Ukázat i sloupce, které vyplňuje účetní — ČÍSLO OBJEDNÁVKY, ZÁKLAD DANĚ, SCHVÁLENO',
        'Nezabíhat do porovnání základu daně, to přijde odpoledne u kontroly',
      ],
    },
    {
      title: 'Pět schodů: z čeho se automatizace skládá',
      min: 20,
      lessons: ['od-mapy-k-automatu/jak-se-nastavuje-automatizace'],
      kind: 'talk',
      who: 'Lektor',
      steps: [
        { title: 'Zadání → pravidlo → skill → hook → běh bez tebe', min: 6, detail: 'Každý schod je jeden soubor a dává smysl, jen když ten pod ním už stojí', lessons: ['od-mapy-k-automatu/jak-se-nastavuje-automatizace'] },
        { title: 'Struktura zadání, které projde napoprvé', min: 6, detail: 'Co vzít, co udělat, kam uložit, co s výjimkou — a rozcestí číslem, ne úsudkem' },
        { title: 'Tři otázky na každý výstup', min: 8, detail: 'Sedí počty, sedí součty, sedí vzorek' },
      ],
      notes: [
        'Kontrola je nejdůležitější věc celého dne — bez ní nikdo nikdy nepustí nic bez dozoru',
        'Říct nahlas: „neptej se, jestli je to správně“. Odpověď ano je tvrzení o tvrzení.',
        'Ukázat vyplněný kontrolní protokol z kontroly faktur, včetně toho řádku o nesedící částce',
        'Pasti ukázat na exportu objednávek, ne obecně',
        'Kdo se ptá na skilly: ukázat rozbor toho skutečného — původní verze, čtyři slabiny, vylepšená',
      ],
    },
    {
      title: 'Pauza',
      min: 10,
      kind: 'break',
      notes: ['Odpočet nechat na plátně', 'Kresby vylepit na zeď, ať jsou po pauze vidět'],
    },
    {
      title: 'Stáhnout cvičný projekt a pustit ho',
      min: 15,
      lessons: ['od-mapy-k-automatu/cvicny-projekt-faktury'],
      kind: 'work',
      who: 'Lektor + asistence',
      brief:
        'Hotový projekt ke stažení: rozbalit, otevřít v Claude Code a pustit jednou větou. ' +
        'Nic se v něm nepíše — jde o to vidět, co má na konci vzniknout, než to za chvíli ' +
        'budete stavět od prázdné složky.',
      steps: [
        { title: 'Stáhnout zip a rozbalit — i skrytou složku .claude', min: 4 },
        { title: 'Otevřít složku v Claude Code, potvrdit důvěru', min: 3 },
        { title: 'Napsat: Postupuj podle skillu kontrola-faktur.', min: 5 },
        { title: 'Projít, co přibylo v data/ a ve vystup/', min: 3, detail: 'Pět faktur v evidenci, u jedné chybí číslo objednávky' },
      ],
      notes: [
        'Odkaz na zip je v lekci Cvičný projekt: kontrola faktur ke stažení — nechat ho na plátně',
        'Ve vstup/ leží pět faktur a evidence je prázdná, takže první běh má co dělat',
        'Odeslaná pošta zůstane prázdná a do evidence se zapíše „adresa dodavatele nenalezena, k ruční kontrole" — ne kvůli chybějícímu konektoru, ale proto, že vzorové faktury ve vstup/ leží od začátku a nepřišly e-mailem, takže k nim není adresa. Říct to dopředu, jinak to sál bere jako chybu.',
        'Kdo si to nestihne stáhnout, ať kouká sousedovi. Za chvíli se stejně staví od nuly, tohle je jen ukázka cíle.',
        'Nenechat je to číst řádek po řádku — na to je lekce potom. Tady jen pustit a podívat se na výsledek.',
        'Až padne dotaz „a jak se tam ta faktura dostane doopravdy": jsou dvě cesty. Naplánovaná automatizace čte Doručenou poštu přes M365 konektor a bere e-mail i přílohu rovnou jako text, nic neukládá — a jen z týhle cesty se odesílá, protože jen tady je adresa. Skill sám umí jen PDF, která už ve vstup/ leží; ta nemají odesílatele, takže u nich odpověď vždycky skončí k ruční kontrole.',
        'Do vstup/ Claude nezapisuje vůbec, ani novou fakturu — zakazuje mu to hook. Soubory tam dává jen člověk.',
      ],
    },
    {
      title: 'Postav si tu složku sám',
      min: 45,
      lessons: ['od-mapy-k-automatu/postav-slozku-sam', 'od-mapy-k-automatu/jak-se-nastavuje-automatizace'],
      kind: 'work',
      who: 'Lektor + asistence',
      brief:
        'Prázdná složka a šest souborů, jeden po druhém — tytéž, co jsou ve staženém vzoru. ' +
        'Vzor necháme zavřený: kopírováním se to naučit nedá a utekla by právě ta zajímavá část, ' +
        'totiž místa, kde se Claude začne ptát. Otevře se až na konci, na porovnání.',
      steps: [
        { title: 'Prázdná složka, v ní vstup/ a data/, otevřít v Claude Code', min: 5 },
        { title: 'Napsat zadani.md vlastními slovy — šest odpovědí', min: 12 },
        { title: 'Nechat podle něj složku postavit a zapisovat si otázky', min: 12 },
        { title: 'Projít, co vzniklo, a vyzkoušet zábranu nad vstup/', min: 8, lessons: ['claude-a-firemni-data/projekt-v-claude-code'] },
        { title: 'Pustit dvakrát za sebou — podruhé se nemá stát nic', min: 4 },
        { title: 'Teprve teď otevřít vzor a porovnat', min: 4 },
      ],
      notes: [
        'Nejdelší blok a hlavní důvod, proč tu lidi jsou',
        'Obcházet — tady se pozná, komu chybí pravidlo a kdo si vzal moc velké sousto',
        'Připomínat: doříkání jsou to nejcennější, ať si je zapisují',
        'Kdo skončí dřív, ať přidá ke skillu kontrolu na konec',
        'Hotovo je, když to projde dvakrát po sobě bez opravy — ne když to vyjde jednou',
        'Laťka pro skill: má sekci „zastav se, když“ a nechá po sobě kontrolní protokol v souboru, ne v chatu',
        'Kdo chce vidět celou cestu až po rozeslané maily, má ji v druhé polovině lekce Jak se v projektu nastaví automatizace',
      ],
    },
    {
      title: 'Živá ukázka: naplánovaný běh',
      min: 10,
      lessons: ['od-mapy-k-automatu/naplanovana-uloha'],
      kind: 'talk',
      who: 'Lektor',
      steps: [
        { title: 'Naplánovat běh na čas za pět minut', min: 3, detail: 'Větou v chatu, ne formulářem — „založ mi automatizaci, která se spustí za pět minut" a zadání. Formulář má sedm polí a sál u toho usne.', lessons: ['od-mapy-k-automatu/naplanovana-uloha'] },
        { title: 'Zavřít to a mluvit o něčem jiném', min: 5, detail: 'Zbylé dva schody: hook a běh bez dozoru', lessons: ['od-mapy-k-automatu/jak-se-nastavuje-automatizace'] },
        { title: 'Podívat se, co přibylo', min: 2, detail: 'Notifikace, soubor s dnešním datem, a kolegovi ve schránce zpráva — ať to potvrdí nahlas' },
      ],
      notes: [
        'Zadání automatizace diktovat větou v chatu; formulářová varianta je v lekci Automatizace v Claude Code pomocí routine',
        'Naplánovat hned na začátku bloku, ať to stihne doběhnout',
        'V Claude Code: Code → Routines → New routine → Local. Cloud varianta nevidí složku na disku.',
        'Tohle není látka, je to důkaz — nechat to zapůsobit a nekomentovat to moc',
        'Zmínit, že u e-mailu je potřeba opatrnost: odeslaná pošta se nevrací',
        'Automatizace na ukázku: spočítat soubory v data/, zapsat do vystup/ a dát vědět kolegovi z dvojice',
        'Dva různé důvody, proč se nic neodeslalo, a je dobré je nesplést: chybí write tools → „připraveno, čeká na konektor"; chybí adresa dodavatele → „adresa dodavatele nenalezena, k ruční kontrole". Obojí je správný konec běhu, ne chyba.',
        'Když padne dotaz na e-mail: konektor M365 odesílat umí, ale write tools musí zapnout správce a nejde přes ně poslat příloha — výstup do knihovny, do mailu odkaz',
        'Odkázat na lekci Jak se v projektu nastaví automatizace — checklist před plánem, runbook, co když spadne',
      ],
    },
    {
      title: 'Pauza',
      min: 10,
      kind: 'break',
    },
    {
      title: 'Rozhovory ve dvojicích: co děláš ručně ty',
      min: 35,
      lessons: ['od-mapy-k-automatu/zmapuj-kolegovi-workflow'],
      kind: 'work',
      who: 'Lektor + asistence',
      brief:
        'Osmdesát procent automatizace je tahle hodina, ne formulář — nastavit routine je deset minut. ' +
        'Hotovou automatizaci jste právě viděli zevnitř. Teď to samé najděte ve své práci: ve ' +
        'dvojicích si navzájem vyzpovídáte kus agendy, kde někde vstupuje e-mail nebo tabulka a někam ' +
        'něco posíláte dál. Technika je kontextové dotazování: neptej se „jak to děláš“, ale „ukaž mi, ' +
        'jak jsi to dělala naposledy“. Uklizená verze bez výjimek je k ničemu.',
      steps: [
        { title: 'Každý si vybere svůj výsek a napíše ho jednou větou', min: 4 },
        { title: 'A se ptá, B popisuje. Nahrávat na telefon.', min: 14 },
        { title: 'Prohodit se — B se ptá, A popisuje', min: 14 },
        { title: 'Uložit nahrávku do projektu do podklady/', min: 3 },
      ],
      examples: [
        {
          title: 'Něco, co děláš každý týden',
          detail: 'Ne to nejsložitější, co máš. Stačí výsek od „přijde mi to“ po „pošlu to dál“.',
        },
        {
          title: 'Kde vstupuje e-mail nebo tabulka',
          detail: 'Právě tam se data přelévají ručně a právě to hledáme.',
        },
        {
          title: 'Kde na někoho čekáš',
          detail: 'Kroky, kde proces stojí a čeká na odpověď, bývají nejdražší.',
        },
        {
          title: 'Co bys musela vysvětlovat náhradě',
          detail: 'Když si nemůžeš vzpomenout na žádný proces, tohle je ta správná otázka.',
        },
      ],
      notes: [
        'Říct nahlas ten poměr: osmdesát procent práce je pochopit proces, dvacet procent je nastavit routine — jinak si sál myslí, že tahle hodina je vata před tím pravým',
        'Technika má jméno — kontextové dotazování. Čtyři pravidla jsou v lekci: kontext, partnerství, ověřování, zaměření. Stačí říct to první: nejsi auditor, jsi učeň.',
        'Zapisuje se mapa úkolu, ne věty: krok / kdo / čím to přijde / co vypadne / kde se čeká / podle čeho se rozhoduje',
        'Kreslí ten, kdo se ptal — ne majitel agendy. Říct to nahlas hned na začátku.',
        'Připomenout, ať se zeptají, než začnou nahrávat',
        'Deset otázek a tabulka signálních slov jsou v akademii — nechat odkaz na plátně',
        'Obcházet a hlídat, jestli se tazatelé neptají obecně místo na poslední konkrétní případ',
        'Hlídat čas u prohození — druhý rozhovor bývá kratší, protože už vědí jak',
      ],
    },
    {
      title: 'Kresba flow a označení míst',
      min: 15,
      lessons: ['od-mapy-k-automatu/nakresli-flow'],
      kind: 'work',
      who: 'Lektor + asistence',
      steps: [
        { title: 'Nakreslit flow do tří pruhů', min: 9, detail: 'Kdo dodává vstup / ty / kdo dostává výstup' },
        { title: 'Popsat šipky — čím se co přenáší', min: 2, detail: 'E-mail, sdílená tabulka, print screen, telefon' },
        { title: 'Označit každý krok jednou ze tří značek', min: 4 },
      ],
      examples: [
        { title: 'Ruční přenos', detail: 'Data mění formu nebo místo a dělá to člověk. Nejsilnější kandidát.' },
        { title: 'Rozhoduje člověk', detail: 'Krok závisí na něčem, co v datech není. Zapsat, podle čeho se rozhoduje.' },
        { title: 'Počítá se z pravidel', detail: 'Výsledek jde odvodit ze vstupů, i když se dnes dělá ručně.' },
      ],
      notes: [
        'Papír na šířku, tři barvy fixů. Kresba nemusí být hezká, musí být čitelná pro cizího.',
        'Popis šipky je důležitější než boxy — automatizuje se přenos, ne práce',
        'Nejzajímavější je hranice mezi „rozhoduje člověk“ a „počítá se z pravidel“',
        'Kdo se zasekne, ať označí místo, kde to nejde dokreslit — tam informace chybí i v reálu',
      ],
    },
    {
      title: 'Sdílení map',
      min: 10,
      lessons: ['od-mapy-k-automatu/sdileni-map'],
      kind: 'qna',
      who: 'Martin',
      steps: [
        { title: 'Každá dvojice dvě minuty', min: 8, detail: 'Jeden nejhorší krok a jeden nápad' },
        { title: 'Co se opakuje napříč odděleními', min: 2 },
      ],
      notes: [
        'Držet dvě minuty na dvojici, jinak se to rozjede',
        'Zapisovat si na flip, co se opakuje — to je materiál pro příště',
        'Nekomentovat každou mapu, jen si všímat vzorců',
      ],
    },
    {
      title: 'Domluva, co do příště',
      min: 5,
      kind: 'qna',
      who: 'Martin',
      steps: [
        { title: 'Úkol na týden: tentýž postup na vlastní agendě', min: 3, lessons: ['od-mapy-k-automatu/postav-slozku-sam'] },
        {
          title: 'Kam se vracet v akademii',
          min: 2,
          detail:
            'Referenční lekce. Neposílat celý seznam — každému tu jednu, která sedí na to, co dneska stavěl. Rozcestník podle situací je v lekci Jak workshop poběží.',
          lessons: [
            'claude-a-firemni-data/slovnicek',
            'claude-a-firemni-data/kolik-to-stoji',
            'claude-a-firemni-data/z-coworku-do-claude-code',
            'od-mapy-k-automatu/jak-se-nastavuje-automatizace',
            'od-mapy-k-automatu/postav-slozku-sam',
            'od-mapy-k-automatu/naplanovana-uloha',
            'od-mapy-k-automatu/formular-misto-emailu',
            'od-mapy-k-automatu/cvicny-projekt-faktury',
            'od-mapy-k-automatu/mcp-nad-katalogem',
            'od-mapy-k-automatu/dek-design-system',
          ],
        },
      ],
      examples: [
        {
          title: 'Kontrola úplnosti faktur',
          detail:
            'Vzor: skill kontrola-faktur. Z PDF faktur ve vstup/ šest povinných údajů do evidence podle dodavatele — kde něco chybí, tam skill sám navrhne žádost o doplnění.',
        },
        {
          title: 'Spojení tří zdrojů k položkám',
          detail:
            'Ke každé položce dotáhnout min/max, SD CS a zásobu na CS. Kde údaj chybí, nechat prázdno a vypsat čísla těch položek.',
        },
        {
          title: 'Týdenní přehled z exportu',
          detail:
            'Z pravidelného exportu udělat přehled, který jinak skládáš ručně. Autodoprava, BI, marketing — každý má svůj.',
        },
        {
          title: 'Vyčištění tabulky do použitelného tvaru',
          detail:
            'Sloučené buňky, hlavička na třetím řádku, kódy jako text. Vyčištěná kopie do vystup/, originál se nesahá.',
        },
        {
          title: 'Kontrolní protokol k hotovému výstupu',
          detail:
            'Kdo má hotovo dřív: nechat si k výstupu vyrobit kontrolu — počty, součty, vzorek a seznam položek bez dat.',
        },
      ],
      notes: [
        'Úkol je jediný: vzít jedno místo z dnešní mapy a postavit k němu složku stejně jako v sále — a přinést zpátky, co se stalo',
        'Říct nahlas, že „nepustila jsem to a tady je proč“ je platná odpověď — nejcennější z celého úkolu',
        'Lekce označené štítkem potom jsou referenční, ať je nečtou dopředu',
        'Neposílat je na všechny — říct jednu podle toho, co kdo dneska stavěl',
        'Jak se v projektu nastaví automatizace je ta hlavní: pět schodů a v druhé polovině hotspot 2 od složky až po naplánovaný běh, s vyplněným formulářem automatizace',
        'MCP nad katalogem je bonus pro zvědavé — server je v repu, rozjede se třemi příkazy',
        'Lekci Kolik to stojí poslat všem, ne jen jednomu: limit je společný pro chat, Cowork i Claude Code a ptali se na to',
        'Z Coworku do Claude Code je pro většinu sálu — pracují zatím jen v Coworku',
        'Formulář místo e-mailů dát tomu, kdo čeká na odpovědi od poboček; Cvičný projekt tomu, kdo řeší faktury nebo dodací listy',
        'Cvičný projekt je hotový ke stažení — kdo si po workshopu neví rady, kde začít, ať začne tam',
        'Design system je pro ty, kdo si staví vlastní aplikace a chtějí, aby vypadaly jako DEK',
        'Pět tvarů níž je menu k domácímu úkolu — kdo neví, co si vzít, ať si vybere ten, který poznává ze své agendy',
        'Kdo dneska nenašel svoji rutinu, není to selhání — dostane Z Coworku do Claude Code a Kolik to stojí, ty platí pro každého',
        'Nahrávky a přepisy z dnešních rozhovorů ať zůstanou v projektech',
      ],
    },
  ],
}
