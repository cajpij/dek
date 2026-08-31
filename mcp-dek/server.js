#!/usr/bin/env node
/**
 * MCP server nad veřejným katalogem dek.cz.
 *
 * Staví jen na tom, co web sám nabízí strojům:
 *  - sitemapy z export.dek.cz (odkaz na ně je přímo v robots.txt)
 *  - JSON-LD Product a BreadcrumbList na stránce produktu
 *
 * Vyhledávání na webu (/search) robots.txt zakazuje, takže se sem neleze.
 * Místo toho si server jednou stáhne rejstřík produktů ze sitemap a hledá
 * v něm lokálně — je to rychlejší a web to nezatěžuje.
 *
 * Spuštění rejstříku napřed (nepovinné, jinak se postaví při prvním hledání):
 *   node server.js --build-index
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import path from 'node:path'

const SITEMAP_INDEX = 'https://export.dek.cz/dek/sitemap.xml'
const UA = 'mcp-dek/0.1 (interní nástroj DEK; kontakt: stavebniny@dek.cz)'
const CACHE_DIR = path.join(homedir(), '.cache', 'mcp-dek')
const CACHE_FILE = path.join(CACHE_DIR, 'index.json')
/** Katalog se nemění po hodinách, týden je bohatě dost. */
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000
/** Kolik sitemap stahovat naráz — ohleduplnost k webu je tu důležitější než rychlost. */
const CONCURRENCY = 4

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA } })
  if (!res.ok) throw new Error(`${url} vrátilo ${res.status}`)
  return res.text()
}

const locsOf = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

/** Diakritiku dolů, ať „střecha“ najde i „strecha“. */
const normalize = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

/**
 * Z URL produktu se dá vyčíst kód i název, takže na hledání stačí rejstřík
 * a nemusí se stahovat 84 tisíc stránek.
 * https://www.dek.cz/produkty/detail/1010101045-dek-a-330-role-20m2
 */
function parseProductUrl(url) {
  const m = /\/produkty\/detail\/(\d+)-(.+)$/.exec(url)
  if (!m) return null
  return { kod: m[1], slug: m[2], nazev: m[2].replace(/-/g, ' '), url }
}

function parseCategoryUrl(url) {
  const m = /\/produkty\/vypis\/(\d+)-(.+)$/.exec(url)
  if (!m) return null
  return { id: m[1], nazev: m[2].replace(/-/g, ' '), url }
}

async function buildIndex(log = () => {}) {
  const indexXml = await fetchText(SITEMAP_INDEX)
  const maps = locsOf(indexXml)
  const productMaps = maps.filter((u) => u.includes('eshop-product'))
  const categoryMaps = maps.filter((u) => u.includes('eshop-category'))

  const products = []
  const categories = []

  const run = async (urls, sink, parse) => {
    let i = 0
    const worker = async () => {
      while (i < urls.length) {
        const url = urls[i++]
        try {
          for (const loc of locsOf(await fetchText(url))) {
            const parsed = parse(loc)
            if (parsed) sink.push(parsed)
          }
        } catch (err) {
          log(`přeskočeno ${url}: ${err.message}`)
        }
      }
    }
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, urls.length) }, worker))
  }

  await run(categoryMaps, categories, parseCategoryUrl)
  await run(productMaps, products, parseProductUrl)

  const index = { builtAt: Date.now(), products, categories }
  await mkdir(CACHE_DIR, { recursive: true })
  await writeFile(CACHE_FILE, JSON.stringify(index))
  return index
}

let cached = null

async function getIndex() {
  if (cached) return cached
  try {
    const disk = JSON.parse(await readFile(CACHE_FILE, 'utf8'))
    if (Date.now() - disk.builtAt < CACHE_TTL_MS && disk.products?.length) {
      cached = disk
      return cached
    }
  } catch {
    /* rejstřík ještě není nebo je poškozený — postaví se znovu */
  }
  cached = await buildIndex()
  return cached
}

/**
 * Skóre shody. Nevyžaduje všechna slova — názvy v katalogu jsou konkrétní
 * („isover flora 30mm“), takže obecný dotaz jako „minerální vata“ by při
 * trvání na plné shodě nenašel nic. Plná shoda se ale řadí výš.
 */
function search(items, dotaz, limit) {
  const words = normalize(dotaz).split(' ').filter(Boolean)
  if (words.length === 0) return []
  const hits = []
  for (const item of items) {
    const hay = normalize(`${item.nazev} ${item.kod ?? item.id ?? ''}`)
    let matched = 0
    let score = 0
    for (const word of words) {
      const at = hay.indexOf(word)
      if (at < 0) continue
      matched += 1
      score += 100 - Math.min(at, 90)
    }
    if (matched === 0) continue
    // Bonus za to, kolik slov dotazu se trefilo — úplná shoda vyhrává.
    score *= matched / words.length
    if (matched === words.length) score += 200
    hits.push({ item, score: score - hay.length / 50 })
  }
  return hits
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((h) => h.item)
}

/** Výpis produktů z kategorie. Stránka kategorie odkazy na produkty v HTML má. */
async function categoryProducts(idNeboUrl, limit) {
  const index = await getIndex()
  let url = idNeboUrl
  if (!/^https?:\/\//.test(idNeboUrl)) {
    const found = index.categories.find((c) => c.id === String(idNeboUrl).trim())
    if (!found) throw new Error(`Kategorie s ID ${idNeboUrl} v rejstříku není.`)
    url = found.url
  }
  const html = await fetchText(url)
  const paths = [...new Set([...html.matchAll(/href="(\/produkty\/detail\/[^"]+)"/g)].map((m) => m[1]))]
  const byUrl = new Map(index.products.map((p) => [new URL(p.url).pathname, p]))
  return {
    kategorie: url,
    pocet: Math.min(paths.length, limit),
    poznamka:
      paths.length >= 25
        ? 'Stránka kategorie vrací jen první várku produktů; na další je potřeba stránkování webu.'
        : undefined,
    produkty: paths.slice(0, limit).map((path) => {
      const known = byUrl.get(path)
      return known
        ? { kod: known.kod, nazev: known.nazev, url: known.url }
        : { kod: null, nazev: path.split('/').pop().replace(/-/g, ' '), url: `https://www.dek.cz${path}` }
    }),
  }
}

/** Ze stránky produktu se čte JSON-LD, ne HTML — je to stabilnější a je k tomu určené. */
async function productDetail(kodNeboUrl) {
  const index = await getIndex()
  let url = kodNeboUrl
  if (!/^https?:\/\//.test(kodNeboUrl)) {
    const found = index.products.find((p) => p.kod === String(kodNeboUrl).trim())
    if (!found) throw new Error(`Produkt s kódem ${kodNeboUrl} v rejstříku není.`)
    url = found.url
  }

  const html = await fetchText(url)
  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  let product = null
  let breadcrumb = null
  for (const [, raw] of blocks) {
    try {
      const data = JSON.parse(raw.trim())
      if (data['@type'] === 'Product') product = data
      if (data['@type'] === 'BreadcrumbList') breadcrumb = data
    } catch {
      /* cizí blok, který nás nezajímá */
    }
  }
  if (!product) throw new Error(`Na ${url} není JSON-LD Product — možná se změnila šablona webu.`)

  const dostupnost = String(product.offers?.availability ?? '').split('/').pop()
  return {
    kod: product.sku,
    nazev: product.name,
    popis: product.description,
    znacka: product.brand?.name,
    cena: product.offers?.price ? Number(product.offers.price) : null,
    mena: product.offers?.priceCurrency ?? null,
    dostupnost: dostupnost || null,
    obrazek: product.image ?? null,
    url,
    zarazeni: (breadcrumb?.itemListElement ?? [])
      .map((e) => e.item?.name)
      .filter((n) => n && n !== 'www.dek.cz'),
    poznamka:
      'Ceny a dostupnost jsou z veřejného webu a bez přihlášení, takže neodpovídají ' +
      'zákaznickým ani pobočkovým cenám. Technické listy a parametry ve veřejném HTML nejsou.',
  }
}

const TOOLS = [
  {
    name: 'hledat_produkt',
    description:
      'Najde produkty v katalogu dek.cz podle názvu nebo kódu. Hledá se v lokálním rejstříku ' +
      'postaveném ze sitemap, takže je to rychlé a web to nezatěžuje. Vrací kód, název a odkaz. ' +
      'Názvy v katalogu jsou konkrétní (značka a rozměr), takže na obecné dotazy typu „minerální vata“ ' +
      'je lepší najít kategorii přes hledat_kategorii a vypsat ji přes produkty_v_kategorii.',
    inputSchema: {
      type: 'object',
      properties: {
        dotaz: { type: 'string', description: 'Např. „asfaltový pás“, „minerální vata“ nebo kód 1010101045' },
        limit: { type: 'number', description: 'Kolik výsledků vrátit, výchozí 10' },
      },
      required: ['dotaz'],
    },
  },
  {
    name: 'detail_produktu',
    description:
      'Vrátí detail produktu z dek.cz: název, popis, značku, veřejnou cenu, dostupnost a zařazení ' +
      'do kategorií. Bere se z JSON-LD na stránce produktu.',
    inputSchema: {
      type: 'object',
      properties: {
        kod: { type: 'string', description: 'Kód produktu (např. 1010101045) nebo celá adresa stránky' },
      },
      required: ['kod'],
    },
  },
  {
    name: 'hledat_kategorii',
    description: 'Najde kategorie v katalogu dek.cz podle názvu. Hodí se, když chceš procházet sortiment.',
    inputSchema: {
      type: 'object',
      properties: {
        dotaz: { type: 'string', description: 'Např. „hydroizolace“, „ploché střechy“' },
        limit: { type: 'number', description: 'Kolik výsledků vrátit, výchozí 15' },
      },
      required: ['dotaz'],
    },
  },
  {
    name: 'produkty_v_kategorii',
    description:
      'Vypíše produkty z kategorie dek.cz. Hodí se, když je dotaz obecný („minerální vata“) — ' +
      'najdi kategorii přes hledat_kategorii a pak si nech vypsat, co v ní je.',
    inputSchema: {
      type: 'object',
      properties: {
        kategorie: { type: 'string', description: 'ID kategorie (např. 1691) nebo celá adresa výpisu' },
        limit: { type: 'number', description: 'Kolik produktů vrátit, výchozí 25' },
      },
      required: ['kategorie'],
    },
  },
  {
    name: 'stav_rejstriku',
    description:
      'Řekne, kolik produktů a kategorií je v rejstříku a kdy se stavěl. Volitelně ho postaví znovu.',
    inputSchema: {
      type: 'object',
      properties: {
        obnovit: { type: 'boolean', description: 'true = stáhnout sitemapy znovu' },
      },
    },
  },
]

const server = new Server(
  { name: 'mcp-dek', version: '0.1.0' },
  { capabilities: { tools: {} } },
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params
  try {
    let payload
    switch (name) {
      case 'hledat_produkt': {
        const index = await getIndex()
        const nalezeno = search(index.products, args.dotaz, args.limit ?? 10)
        payload = { pocet: nalezeno.length, produkty: nalezeno.map(({ slug, ...rest }) => rest) }
        break
      }
      case 'detail_produktu':
        payload = await productDetail(args.kod)
        break
      case 'hledat_kategorii': {
        const index = await getIndex()
        payload = { kategorie: search(index.categories, args.dotaz, args.limit ?? 15) }
        break
      }
      case 'produkty_v_kategorii':
        payload = await categoryProducts(args.kategorie, args.limit ?? 25)
        break
      case 'stav_rejstriku': {
        if (args.obnovit) cached = await buildIndex()
        const index = await getIndex()
        payload = {
          produktu: index.products.length,
          kategorii: index.categories.length,
          postaveno: new Date(index.builtAt).toISOString(),
          soubor: CACHE_FILE,
        }
        break
      }
      default:
        throw new Error(`Neznámý nástroj: ${name}`)
    }
    return { content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }] }
  } catch (err) {
    return {
      isError: true,
      content: [{ type: 'text', text: `Chyba v ${name}: ${err.message}` }],
    }
  }
})

if (process.argv.includes('--build-index')) {
  const index = await buildIndex((m) => console.error(m))
  console.error(`Rejstřík hotov: ${index.products.length} produktů, ${index.categories.length} kategorií`)
  console.error(`Uloženo do ${CACHE_FILE}`)
  process.exit(0)
}

await server.connect(new StdioServerTransport())
