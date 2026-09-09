/** Rychlá zkouška relevance: npx tsx scripts/zkus-hledani.ts [dotaz…] */
import { hledej } from '../src/lib/hledani'

const dotazy = process.argv.slice(2)
const vzorky = dotazy.length ? dotazy : ['rutina.md', 'IČO', 'hook', 'print screen', 'ico dodavatele', 'nesmysl']
for (const dotaz of vzorky) {
  const v = hledej(dotaz)
  console.log(`\n▸ „${dotaz}" — ${v.length} lekcí`)
  for (const x of v.slice(0, 6)) {
    console.log(`   ${String(Math.round(x.skore)).padStart(4)}  ${x.lekce.title.slice(0, 44).padEnd(46)} ${x.ukazka?.puvod ?? '—'}`)
  }
}
