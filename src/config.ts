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
 *  - Celý den stojí na jednom vzoru: proces akčního regálu z logistiky.
 *    Nejdřív se projde společně, pak si každý zmapuje vlastní agendu a nakonec
 *    z ní postaví první automatizaci.
 *  - Dva bloky jsou nedotknutelné — mapování ve dvojicích a stavění. Když se
 *    program rozjede, škrtá se všechno ostatní. Jsou to jediné části, ze
 *    kterých si lidi odnesou něco vlastního.
 *  - Poslední blok je živá ukázka: naplánovaný běh za pět minut. Není to
 *    látka, je to důkaz, že těch pět schodů někam vede.
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
const REGAL_BRIEF =
  'Produkťáci nasypou obsah magazínu do sdílené Google Tabulky. Logistika si vezme svých sedm ' +
  'sloupců, dotáhne k položkám skladová data, rozpadne to na čtyři divizní soubory a rozešle je ' +
  'e-mailem. Produkťáci vyberou, co půjde do regálu, a pošlou to e-mailem zpátky — někdo tabulkou, ' +
  'někdo print screenem. Pak se jde fyzicky zkoušet, jestli se tři kufry vejdou vedle sebe, ' +
  'protože měrné jednotky neodpovídají skutečnosti. Na konci vznikají tři různé podklady pro ' +
  'marketing, centrální sklad a backoffice.'

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
      steps: [
        { title: 'Co dnes vznikne', min: 3, detail: 'Mapa vlastního procesu a jedna hotová automatizace' },
        { title: 'Pět schodů automatizace', min: 5, detail: 'Zadání → pravidlo → skill → hook → běh bez tebe' },
        { title: 'Co je předem hotové a co se dnes nestihne', min: 2 },
      ],
      notes: [
        'Ověřit, že mají všichni nainstalovaný Claude Code — instalace je jediná věc, která měla být předem',
        'Složku nastavujeme hned v dalším bloku, tady jen zjistit, kolik lidí ji nemá',
        'Ukázat schéma pěti schodů z akademie — vrátíme se k němu na konci',
        'Říct rovnou, kam den směřuje: naplánovaný běh, který doběhne, když u toho nikdo nesedí',
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
        'Tyhle dvojice drží celé odpoledne, včetně obou cvičení — říct to hned',
        'Nesbírat řešení, jen sbírat. Kdo začne radit, zarazit ho — přijde to za dvě hodiny.',
        'Držet minutu na člověka, jinak se z toho stane porada',
        'To, co v kolečku zazní, si zapsat — jsou to kandidáti na cvičení 2',
      ],
    },
    {
      title: 'Nastavení: sdílená složka a projekt',
      min: 30,
      kind: 'work',
      who: 'Lektor + asistence',
      brief:
        'Než začneme cokoli mapovat, musí mít každý na disku složku se svými daty a v ní projekt. ' +
        'Je to jediná část večera, kde se něco nastavuje — a děláme ji na začátku schválně, ' +
        'aby se případný problém našel teď a ne ve chvíli, kdy má člověk stavět.',
      steps: [
        { title: 'Nasyncovat knihovnu ze SharePointu', min: 10, detail: 'Přidat zástupce do OneDrivu, počkat, až se stáhne' },
        { title: 'Vždy ponechat v tomto zařízení a připojit složku v Claudovi', min: 5, detail: 'Bez toho jsou na disku jen zástupci a Claude nic nepřečte' },
        { title: 'Založit projekt: složka agendy, data/ a vystupy/', min: 5 },
        { title: 'Napsat CLAUDE.md', min: 10, detail: 'Pět řádků slovníku, kde jsou data, dvě pravidla co se nesmí' },
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
        'Ukázat hotový CLAUDE.md akčního regálu jako vzor, ať neopisují ze vzduchu',
        'Kdo má projekt v nasyncované knihovně, upozornit, že obsah uvidí celý tým',
        'Když někomu nepůjde ani lokální kopie, ať pracuje ve dvojici — večer nesmí propadnout na nastavování',
      ],
    },
    {
      title: 'Vzor: Od magazínu do regálu',
      min: 20,
      kind: 'talk',
      who: 'Lektor',
      brief: REGAL_BRIEF,
      steps: [
        { title: 'Projít proces po krocích', min: 10, detail: 'Deset kroků od sdílené tabulky po tři finální podklady' },
        { title: 'Kde data mění formu ručně', min: 7, detail: 'Nechat sál hádat, než ukážeš tři označená místa' },
        { title: 'Co má zůstat člověku', min: 3, detail: 'Vzorování v regálu — data o měrných jednotkách lžou' },
      ],
      notes: [
        'Tohle je jediný blok, kde se hodně mluví. Držet ho.',
        'Nechat sál hádat, kde se přepisuje — nejde o to říct jim to, jde o to, aby si toho všimli',
        'Zmínit, že jeden krok už dnes běží s Claudem (Logistické dostupnosti), takže to není od nuly',
        'Ukázat i sloupce, které vyplňuje produkťák — AKČNÍ REGÁL, POZNÁMKA, PRIORITA',
        'Nezabíhat do výpočtu MINMAX, ten přijde odpoledne u kontroly',
      ],
    },
    {
      title: 'Cvičení 1 — rozhovory ve dvojicích',
      min: 40,
      kind: 'work',
      who: 'Lektor + asistence',
      brief:
        'Ve dvojicích si navzájem vyzpovídáte kus vlastní práce — takový, kde někde vstupuje e-mail ' +
        'nebo tabulka a někam něco posíláte dál. Technika je kontextové dotazování: neptej se „jak to ' +
        'děláš“, ale „ukaž mi, jak jsi to dělala naposledy“. Uklizená verze bez výjimek je k ničemu.',
      steps: [
        { title: 'Každý si vybere svůj výsek a napíše ho jednou větou', min: 5 },
        { title: 'A se ptá, B popisuje. Nahrávat na telefon.', min: 15 },
        { title: 'Prohodit se — B se ptá, A popisuje', min: 15 },
        { title: 'Uložit nahrávku do projektu do podklady/', min: 5 },
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
        'Kreslí ten, kdo se ptal — ne majitel agendy. Říct to nahlas hned na začátku.',
        'Připomenout, ať se zeptají, než začnou nahrávat',
        'Deset otázek a tabulka signálních slov jsou v akademii — nechat odkaz na plátně',
        'Obcházet a hlídat, jestli se tazatelé neptají obecně místo na poslední konkrétní případ',
        'Hlídat čas u prohození — druhý rozhovor bývá kratší, protože už vědí jak',
      ],
    },
    {
      title: 'Cvičení 1b — kresba flow a označení míst',
      min: 15,
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
      title: 'Pauza',
      min: 10,
      kind: 'break',
      notes: ['Odpočet nechat na plátně', 'Kresby vylepit na zeď, ať jsou po pauze vidět'],
    },
    {
      title: 'Sdílení map',
      min: 10,
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
      title: 'Zadání nad tabulkou a kontrola výsledku',
      min: 25,
      kind: 'talk',
      who: 'Lektor',
      steps: [
        { title: 'Struktura zadání, které projde napoprvé', min: 8, detail: 'Co vzít, co udělat, kam uložit, co s výjimkou' },
        { title: 'Pasti, které tabulka nastraží', min: 7, detail: 'Kódy jako čísla, prázdno vs. nula, hlavička na třetím řádku' },
        { title: 'Tři otázky na každý výstup', min: 10, detail: 'Sedí počty, sedí součty, sedí vzorek' },
      ],
      notes: [
        'Kontrola je nejdůležitější věc celého dne — bez ní nikdo nikdy nepustí nic bez dozoru',
        'Říct nahlas: „neptej se, jestli je to správně“. Odpověď ano je tvrzení o tvrzení.',
        'Ukázat vyplněný kontrolní protokol z akčního regálu, včetně toho řádku o nesedících datech',
        'Pasti ukázat na listu Logistika, ne obecně',
      ],
    },
    {
      title: 'Pauza',
      min: 10,
      kind: 'break',
    },
    {
      title: 'Cvičení 2 — postav si první automatizaci',
      min: 45,
      kind: 'work',
      who: 'Lektor + asistence',
      brief:
        'Vezmi jedno místo ze své mapy — to, kde se přenáší data ručně — a dotáhni ho do skillu, ' +
        'který má na konci vlastní kontrolu. Ne to nejbolestivější. Ber ten krok, který se dá dokončit.',
      steps: [
        { title: 'Vybrat krok a připravit si vstup i výsledek z minula', min: 8 },
        { title: 'Udělat to jednou zadáním a zapisovat si doříkání', min: 15 },
        { title: 'Doříkání, která platí pořád, přepsat do CLAUDE.md', min: 5 },
        { title: 'Nechat si napsat skill a opravit mu description', min: 10 },
        { title: 'Spustit na datech z jiného měsíce', min: 7 },
      ],
      examples: [
        {
          title: 'Rozpad exportu na divizní soubory',
          detail:
            'Vzor: skill logisticke-dostupnosti. Ze sdílené tabulky čtyři soubory pro produkťáky — Nářadí, Elektro, VTS, Piekarová — uvnitř list na každého PM a sloupce k vyplnění prázdné.',
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
            'Sloučené buňky, hlavička na třetím řádku, kódy jako text. Vyčištěná kopie do vystupy/, originál se nesahá.',
        },
        {
          title: 'Kontrolní protokol k hotovému výstupu',
          detail:
            'Kdo má hotovo dřív: nechat si k výstupu vyrobit kontrolu — počty, součty, vzorek a seznam položek bez dat.',
        },
      ],
      notes: [
        'Nejdelší blok a hlavní důvod, proč tu lidi jsou',
        'Obcházet — tady se pozná, komu chybí pravidlo a kdo si vzal moc velké sousto',
        'Připomínat: doříkání jsou to nejcennější, ať si je zapisují',
        'Kdo skončí dřív, ať přidá ke skillu kontrolu na konec',
        'Hotovo je, když to projde dvakrát po sobě bez opravy — ne když to vyjde jednou',
      ],
    },
    {
      title: 'Živá ukázka: naplánovaný běh',
      min: 10,
      kind: 'talk',
      who: 'Lektor',
      steps: [
        { title: 'Naplánovat běh na čas za pět minut', min: 3 },
        { title: 'Zavřít to a mluvit o něčem jiném', min: 5, detail: 'Zbylé dva schody: hook a běh bez dozoru' },
        { title: 'Podívat se, co přibylo', min: 2, detail: 'Notifikace, soubor s dnešním datem, kontrolní protokol' },
      ],
      notes: [
        'Naplánovat hned na začátku bloku, ať to stihne doběhnout',
        'Tohle není látka, je to důkaz — nechat to zapůsobit a nekomentovat to moc',
        'Zmínit, že u e-mailu je potřeba opatrnost: odeslaná pošta se nevrací',
        'Odesílání e-mailu neukazovat naživo — ukázka je notifikace a soubor, to stačí',
        'Když padne dotaz na e-mail: Claude sám neposílá, potřebuje konektor nebo skript. Konektor na M365 čte, ale neodesílá — schvaluje ho správce.',
        'Odkázat na lekci Nech to běžet bez sebe — checklist, runbook, co když spadne',
      ],
    },
    {
      title: 'Domluva, co do příště',
      min: 5,
      kind: 'qna',
      who: 'Martin',
      steps: [
        { title: 'Úkol na týden: pustit to naostro', min: 3 },
        { title: 'Kam se vracet v akademii', min: 2 },
      ],
      notes: [
        'Úkol je jediný: pustit svoji úlohu na skutečné práci a přinést zpátky, co se stalo',
        'Říct nahlas, že „nepustila jsem to a tady je proč“ je platná odpověď — nejcennější z celého úkolu',
        'Lekce označené štítkem potom jsou referenční, ať je nečtou dopředu',
        'Nahrávky a přepisy z dnešních rozhovorů ať zůstanou v projektech',
      ],
    },
  ],
}
