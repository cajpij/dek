/**
 * Obsah stránky o MCP serveru nad katalogem dek.cz.
 *
 * Struktura je vzatá ze stránky Prusa MCP: hero s adresou serveru, příklady
 * dotazů se štítky nástrojů, přehled schopností po skupinách, návod na zapojení
 * a nakonec to, co server vidí a co ne.
 *
 * Rozdíl proti Pruse je podstatný a je potřeba ho říct nahlas: tenhle server
 * neběží nikde v cloudu a nikam se nepřihlašuje. Spouští se u člověka na
 * počítači a čte veřejný katalog. Proto žádné účty, žádné zákaznické ceny.
 */

export interface Example {
  prompt: string
  /** Kterými nástroji to projde — zobrazuje se jako tok pod dotazem. */
  flow: string[]
}

export interface ToolGroup {
  title: string
  summary: string
  tools: string[]
}

export interface SetupTab {
  client: string
  intro: string
  code: string
  after?: string
}

export interface TrustCard {
  title: string
  body: string
}

export const MCP_CONFIG = `{
  "mcpServers": {
    "dek": {
      "command": "node",
      "args": ["/plná/cesta/k/mcp-dek/server.js"]
    }
  }
}`

export const EXAMPLES: Example[] = [
  {
    prompt: 'Kolik stojí asfaltová lepenka DEK A 330 a je skladem?',
    flow: ['HLEDÁNÍ', 'DETAIL'],
  },
  {
    prompt: 'Najdi všechny izolace Isover Flora a srovnej tloušťky, plochu na paletě a ceny.',
    flow: ['HLEDÁNÍ', 'DETAIL'],
  },
  {
    prompt: 'Zákazník chce hydroizolaci na plochou střechu. Co mu můžu nabídnout?',
    flow: ['KATEGORIE', 'VÝPIS', 'DETAIL'],
  },
  {
    prompt: 'K těmhle kódům z objednávky doplň názvy a zařazení do kategorií.',
    flow: ['DETAIL'],
  },
  {
    prompt: 'Projdi tenhle ceník a řekni, u kterých položek se veřejná cena liší.',
    flow: ['HLEDÁNÍ', 'DETAIL'],
  },
  {
    prompt: 'Jsou všechny kódy z tohohle starého seznamu pořád v katalogu?',
    flow: ['HLEDÁNÍ'],
  },
  {
    prompt: 'Co všechno vedeme v technických izolacích?',
    flow: ['KATEGORIE', 'VÝPIS'],
  },
]

export const TOOL_GROUPS: ToolGroup[] = [
  {
    title: 'Produkty',
    summary:
      'Najdi produkt podle názvu nebo kódu a zjisti o něm, co je na webu — popis, značku, veřejnou cenu, ' +
      'dostupnost a kam v sortimentu patří. Hledá se v rejstříku staženém ze sitemap, takže je to okamžité.',
    tools: ['hledat_produkt', 'detail_produktu'],
  },
  {
    title: 'Sortiment',
    summary:
      'Procházej katalog po kategoriích. Hodí se, když je dotaz obecný — „minerální vata“ jako název ' +
      'produktu neexistuje, ale jako kategorie ano.',
    tools: ['hledat_kategorii', 'produkty_v_kategorii'],
  },
  {
    title: 'Rejstřík',
    summary:
      'Kolik toho rejstřík zná a kdy se stavěl. Platí týden a pak se obnoví sám, ale dá se k tomu ' +
      'donutit i ručně, když se katalog výrazně změní.',
    tools: ['stav_rejstriku'],
  },
]

export const SETUP: SetupTab[] = [
  {
    client: 'Claude Cowork',
    intro:
      'Server běží u tebe na počítači, takže ho nejdřív stáhni a připrav rejstřík. Pak ho přidej do ' +
      'nastavení MCP serverů.',
    code: 'cd mcp-dek\nnpm install\nnode server.js --build-index',
    after:
      'Do nastavení MCP serverů přidej blok níž a nahraď cestu tou svojí. Po restartu se Claude na ' +
      'katalog ptá sám, když je to potřeba.',
  },
  {
    client: 'Claude Code',
    intro: 'Přidej server jedním příkazem v terminálu. Rejstřík se postaví při prvním hledání.',
    code: 'claude mcp add --scope user dek node /plná/cesta/k/mcp-dek/server.js',
    after: 'Ověřit si to můžeš příkazem /mcp přímo v Claude Code.',
  },
  {
    client: 'Jiný klient',
    intro:
      'Server mluví přes standardní vstup a výstup, takže funguje s čímkoli, co umí MCP přes stdio. ' +
      'Do konfigurace patří jen příkaz a cesta.',
    code: MCP_CONFIG,
  },
]

export const TRUST: TrustCard[] = [
  {
    title: 'Běží u tebe, ne v cloudu',
    body:
      'Server se spouští na tvém počítači a nemá žádnou serverovou část. Ven jdou jen běžné požadavky ' +
      'na dek.cz, stejné, jako když si stránku otevřeš v prohlížeči. Nic se nikam neposílá a nikde neukládá.',
  },
  {
    title: 'Vidí jen veřejný katalog',
    body:
      'Žádné přihlášení, žádný účet, žádný přístup do interních systémů. To, co server vidí, vidí i kdokoli ' +
      'na webu — a nic víc.',
  },
  {
    title: 'Ceny nejsou zákaznické',
    body:
      'Vrací se veřejná cena bez přihlášení, která neodpovídá zákaznickým ani pobočkovým cenám. Server to ' +
      'připomíná u každého detailu, aby se to omylem nedostalo do nabídky.',
  },
  {
    title: 'Respektuje, co web zakazuje',
    body:
      'robots.txt zakazuje vyhledávání na webu, takže se tam neleze vůbec. Server si místo toho jednou ' +
      'stáhne rejstřík ze sitemap, na které robots.txt sám odkazuje, a hledá lokálně.',
  },
]

export const MISSING: string[] = [
  'Technické listy a parametry — ve veřejném HTML nejsou, dotahují se až v prohlížeči. Na ty je potřeba interní API.',
  'Skladové zásoby po pobočkách — server zná jen obecnou dostupnost z webu.',
  'Objednávky, doklady a cokoli za přihlášením. Tohle je nástroj nad katalogem, ne nad systémy.',
]
