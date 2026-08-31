# mcp-dek

MCP server nad veřejným katalogem [dek.cz](https://www.dek.cz). Dá Claudovi pět nástrojů,
kterými si sám najde produkt, zjistí cenu a dostupnost nebo prochází sortiment.

Postavené na workshopu jako ukázka toho, že vlastní MCP není velká věda — celé je to
jeden soubor, [`server.js`](server.js), a nemá žádnou závislost kromě oficiálního SDK.

## Nástroje

| Nástroj | Co dělá |
| --- | --- |
| `hledat_produkt` | Najde produkty podle názvu nebo kódu v lokálním rejstříku |
| `detail_produktu` | Název, popis, značka, veřejná cena, dostupnost, zařazení do kategorií |
| `hledat_kategorii` | Najde kategorie podle názvu |
| `produkty_v_kategorii` | Vypíše produkty z kategorie — na obecné dotazy lepší než hledání |
| `stav_rejstriku` | Kolik toho rejstřík má a kdy se stavěl; umí ho postavit znovu |

## Spuštění

```bash
npm install
node server.js --build-index    # nepovinné, jinak se rejstřík postaví při prvním hledání
```

Rejstřík se ukládá do `~/.cache/mcp-dek/index.json` a platí týden. Stažení 42 sitemap
trvá pár sekund a vypadne z nich zhruba **81 tisíc produktů a 4 650 kategorií**.

## Zapojení do Claude Cowork

Do konfigurace MCP serverů přidej:

```json
{
  "mcpServers": {
    "dek": {
      "command": "node",
      "args": ["/plná/cesta/k/mcp-dek/server.js"]
    }
  }
}
```

Pak stačí Clauda požádat běžnou větou — „najdi asfaltové pásy typu A a řekni mi ceny“ —
a nástroje si zavolá sám.

## Jak to bere data

Jen tak, jak to web sám nabízí strojům:

- **robots.txt** povoluje `/`, ale zakazuje `/search*`. Vyhledávání na webu se proto
  nepoužívá vůbec. Místo něj si server jednou stáhne rejstřík ze **sitemap**, na které
  robots.txt sám odkazuje, a hledá lokálně. Je to rychlejší a web to nezatěžuje.
- **JSON-LD** (`Product`, `BreadcrumbList`) na stránce produktu — strukturovaná data,
  která tam jsou kvůli vyhledávačům. Stabilnější než tahat věci z HTML podle tříd.
- Stránky se stahují po čtyřech a s vlastní hlavičkou `user-agent`, ať je poznat, kdo chodí.

## Kde jsou hranice

- **Ceny jsou veřejné, bez přihlášení.** Neodpovídají zákaznickým ani pobočkovým cenám.
  Server to připomíná u každého detailu, ať se to omylem nedostane do nabídky.
- **Technické listy a parametry ve veřejném HTML nejsou** — dotahují se až v prohlížeči.
  Kdo je potřebuje (a v dotazníku je chtěl kdekdo), musí sáhnout po interním API. To je
  ale doma, takže je to schůdnější než tohle.
- **Výpis kategorie vrací jen první várku** produktů, na další je potřeba stránkování webu.
- Rejstřík se staví z veřejné sitemapy, takže obsahuje jen to, co je na webu.

## Když se to rozbije

Web se může změnit. Server na to nepadá potichu:

- Chybí-li JSON-LD, `detail_produktu` řekne, že se nejspíš změnila šablona webu.
- Neznámý kód nebo ID kategorie vrátí čitelnou hlášku, ne prázdný výsledek.
- Rozbitý nebo starý rejstřík se postaví znovu sám.
