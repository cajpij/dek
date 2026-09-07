import { useId, useRef, useState } from 'react'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Tab from '@mui/material/Tab'
import Table from '@mui/material/Table'
import Tabs from '@mui/material/Tabs'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import type { Block, VideoRef } from '../academy'
import { usePlatform } from '../lib/academyPlatform'
import AutomationLadder from './AutomationLadder'
import ProjectTree from './ProjectTree'
import RegalFlow from './RegalFlow'
import RoutineForm from './RoutineForm'
import TokenDrains from './TokenDrains'
import ContextGrowth from './ContextGrowth'
import SubagentContext from './SubagentContext'
import ContextWindow from './ContextWindow'
import UsageReport from './UsageReport'
import SyncMap from './SyncMap'

/** Blok kódu nebo cesty, který si člověk odnese přes schránku. */
/**
 * Text jen pro čtečku obrazovky. Rozměry musí být řetězce v pixelech: sx bere
 * číslo 1 jako 100 %, takže `width: 1` udělá z neviditelného prvku pruh přes
 * celou šířku stránky a ta pak jde posouvat do strany.
 */
const SR_ONLY = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  p: 0,
  m: '-1px',
  border: 0,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  clipPath: 'inset(50%)',
} as const

/**
 * Obsah, který drží tvar sloupci: stromy složek a řádky se šipkou vpravo.
 * Takový blok se nesmí zalamovat — zalomení mu rozhodí zarovnání a je
 * nečitelný. Prózu (vlepovaná zadání) naopak zalamovat chceme, aby se
 * nemuselo posouvat do strany.
 */
const KEEPS_SHAPE = /[├└│]|\s←\s/

function Code({ children, label }: { children: string; label?: string }) {
  const [state, setState] = useState<'idle' | 'ok' | 'fail'>('idle')
  const nowrap = KEEPS_SHAPE.test(children)
  const preRef = useRef<HTMLPreElement>(null)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setState('ok')
    } catch {
      // Schránka není k dispozici (http, zakázané oprávnění) — aspoň text označit,
      // ať stačí Ctrl+C / Cmd+C.
      const el = preRef.current
      if (el) {
        const range = document.createRange()
        range.selectNodeContents(el)
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
      }
      setState('fail')
    }
    window.setTimeout(() => setState('idle'), 2500)
  }
  const text =
    state === 'ok' ? 'Zkopírováno' : state === 'fail' ? 'Označeno — stiskni Ctrl+C' : 'Kopírovat'
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', flexWrap: 'wrap', my: 1.5 }}>
      <Box
        component="pre"
        ref={preRef}
        tabIndex={0}
        sx={{
          flex: '1 1 320px',
          // Bez tohohle by se pre roztáhlo podle nejdelšího řádku a posouvala
          // by se celá stránka místo samotného bloku.
          minWidth: 0,
          m: 0,
          p: 1.75,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1.5,
          bgcolor: 'action.hover',
          fontFamily: 'ui-monospace, Menlo, monospace',
          fontSize: 13,
          lineHeight: 1.65,
          whiteSpace: nowrap ? 'pre' : 'pre-wrap',
          overflowX: 'auto',
          '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
        }}
      >
        {children}
      </Box>
      <Button
        size="small"
        variant="outlined"
        color="inherit"
        onClick={copy}
        sx={{ mt: 0.25 }}
        aria-label={label ? `Kopírovat: ${label}` : undefined}
      >
        {text}
      </Button>
      <Box component="span" role="status" aria-live="polite" sx={SR_ONLY}>
        {state === 'ok' ? 'Zkopírováno do schránky' : state === 'fail' ? 'Text je označený, zkopíruj ho klávesovou zkratkou' : ''}
      </Box>
    </Box>
  )
}

/** Odškrtávací seznam — stav je jen v hlavě stránky, nikam se neukládá. */
function Checklist({ title, items }: { title: string; items: string[] }) {
  const [done, setDone] = useState<Record<number, boolean>>({})
  return (
    <Paper variant="outlined" sx={{ p: 2.5, my: 3, borderRadius: 2 }}>
      <Typography sx={{ fontWeight: 650, mb: 1 }}>{title}</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {items.map((item, i) => (
          <FormControlLabel
            key={item}
            control={
              <Checkbox
                size="small"
                checked={done[i] ?? false}
                onChange={() => setDone((p) => ({ ...p, [i]: !p[i] }))}
              />
            }
            label={
              <Typography
                sx={{
                  fontSize: 15,
                  color: done[i] ? 'text.disabled' : 'text.primary',
                  textDecoration: done[i] ? 'line-through' : 'none',
                }}
              >
                {item}
              </Typography>
            }
          />
        ))}
      </Box>
    </Paper>
  )
}

function Steps({
  items,
}: {
  items: {
    title: string
    body: string
    code?: string
    links?: { label: string; href: string; note?: string }[]
  }[]
}) {
  return (
    <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0, my: 2 }}>
      {items.map((step, i) => (
        <Box
          component="li"
          key={step.title}
          sx={{
            display: 'grid',
            gridTemplateColumns: '34px 1fr',
            gap: 2,
            py: 2.25,
            borderTop: i === 0 ? 0 : 1,
            borderColor: 'divider',
          }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: 1,
              borderColor: 'divider',
              display: 'grid',
              placeItems: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: 'text.secondary',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {i + 1}
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 650, fontSize: 16.5, mb: 0.5 }}>{step.title}</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 15.5, maxWidth: '68ch' }}>
              {step.body}
            </Typography>
            {step.code ? <Code>{step.code}</Code> : null}
            {step.links?.length ? (
              <Box sx={{ mt: 1.25 }}>
                {step.links.map((link) => (
                  <Box key={link.href} sx={{ mt: 0.5 }}>
                    <Link
                      href={link.href}
                      target="_blank"
                      rel="noopener"
                      underline="hover"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        fontSize: 15,
                        fontWeight: 550,
                        py: 0.25,
                      }}
                    >
                      {link.label}
                      <Box component="span" aria-hidden sx={{ fontSize: 13 }}>
                        ↗
                      </Box>
                    </Link>
                    {link.note ? (
                      <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{link.note}</Typography>
                    ) : null}
                  </Box>
                ))}
              </Box>
            ) : null}
          </Box>
        </Box>
      ))}
    </Box>
  )
}

function Task({
  title,
  intro,
  items,
  hint,
}: {
  title: string
  intro: string
  items: string[]
  hint?: string
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        my: 3.5,
        borderRadius: 2,
        borderLeftWidth: 4,
        borderLeftColor: 'primary.main',
        p: { xs: 2.5, md: 3 },
      }}
    >
      <Typography
        sx={{
          fontSize: 11.5,
          letterSpacing: '.14em',
          textTransform: 'uppercase',
          fontWeight: 700,
          color: 'primary.main',
          mb: 1,
        }}
      >
        Úkol
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 680, mb: 1 }}>
        {title}
      </Typography>
      <Typography sx={{ color: 'text.secondary', fontSize: 15.5, maxWidth: '68ch' }}>{intro}</Typography>
      <Box component="ol" sx={{ pl: 2.5, mt: 1.5, mb: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {items.map((item) => (
          <Typography component="li" key={item} sx={{ fontSize: 15.5, maxWidth: '66ch' }}>
            {item}
          </Typography>
        ))}
      </Box>
      {hint ? (
        <Typography sx={{ mt: 2, fontSize: 14.5, color: 'text.disabled', maxWidth: '68ch' }}>
          {hint}
        </Typography>
      ) : null}
    </Paper>
  )
}

/** Vložené YouTube — cizí videa, kde to někdo ukázal líp než text. */
function Videos({ title, items }: { title: string; items: VideoRef[] }) {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 680, mb: 0.5 }}>
        {title}
      </Typography>
      <Typography sx={{ color: 'text.disabled', fontSize: 14, mb: 2 }}>
        Cizí videa v angličtině. Nejsou povinná — jsou tu pro případ, že si to potřebuješ vidět
        naklikané.
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 2.5,
        }}
      >
        {items.map((v) => (
          <Paper key={v.id} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box
              component="iframe"
              src={`https://www.youtube-nocookie.com/embed/${v.id}`}
              title={v.title}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
              sx={{ display: 'block', width: '100%', aspectRatio: '16 / 9', border: 0 }}
            />
            <Box sx={{ p: 2 }}>
              <Typography sx={{ fontWeight: 620, fontSize: 15, lineHeight: 1.35 }}>{v.title}</Typography>
              <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.25 }}>{v.author}</Typography>
              <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 1 }}>{v.note}</Typography>
              <Link
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target="_blank"
                rel="noopener"
                underline="hover"
                sx={{ fontSize: 13.5, mt: 1, display: 'inline-block' }}
              >
                Otevřít na YouTube <span aria-hidden>↗</span>
                <Box component="span" sx={SR_ONLY}> (otevře se v novém okně)</Box>
              </Link>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  )
}

/** Odkazy do oficiální dokumentace — místo, kam se člověk vrátí, až mu text nestačí. */
function Links({ title, items }: { title: string; items: { label: string; href: string; note?: string }[] }) {
  return (
    <Paper variant="outlined" sx={{ my: 3, borderRadius: 2, p: 2.5 }}>
      <Typography
        sx={{
          fontSize: 12.5,
          letterSpacing: '.1em',
          textTransform: 'uppercase',
          fontWeight: 700,
          color: 'text.secondary',
          mb: 1.5,
        }}
      >
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        {items.map((l) => (
          <Box key={l.href}>
            <Link href={l.href} target="_blank" rel="noopener" underline="hover" sx={{ fontSize: 15.5, fontWeight: 550 }}>
              {l.label} <span aria-hidden>↗</span>
              <Box component="span" sx={SR_ONLY}> (otevře se v novém okně)</Box>
            </Link>
            {l.note ? (
              <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{l.note}</Typography>
            ) : null}
          </Box>
        ))}
      </Box>
    </Paper>
  )
}

/** Táž látka na příkladech z různých agend. */
function AgendaTabs({ items }: { items: { label: string; blocks: Block[] }[] }) {
  const [tab, setTab] = useState(0)
  const tabsId = useId()
  const current = items[tab] ?? items[0]!
  return (
    <Box sx={{ my: 3 }}>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Varianty"
        sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 40, mb: 1 }}
      >
        {items.map((it, i) => (
          <Tab
            key={it.label}
            label={it.label}
            id={`${tabsId}-tab-${i}`}
            aria-controls={`${tabsId}-panel-${i}`}
            sx={{ minHeight: 40, py: 1 }}
          />
        ))}
      </Tabs>
      <Box role="tabpanel" id={`${tabsId}-panel-${tab}`} aria-labelledby={`${tabsId}-tab-${tab}`}>
        {current.blocks.map((b, i) => (
          <BlockView key={i} block={b} />
        ))}
      </Box>
    </Box>
  )
}

/** Přepínač Mac / Windows — ukáže jen tu variantu, na které člověk sedí. */
function PlatformSwitch({ mac, win }: { mac: Block[]; win: Block[] }) {
  const [platform, choose] = usePlatform()
  const blocks = platform === 'mac' ? mac : win
  return (
    <Box sx={{ my: 2 }}>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={platform}
        onChange={(_, next) => next && choose(next)}
        aria-label="Operační systém"
        sx={{ mb: 1 }}
      >
        <ToggleButton value="mac">macOS</ToggleButton>
        <ToggleButton value="win">Windows</ToggleButton>
      </ToggleButtonGroup>
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </Box>
  )
}

const TONE = { info: 'info', warn: 'warning', ok: 'success' } as const

/** Vykreslí jeden blok obsahu lekce. */
export default function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'p':
      return (
        <Typography sx={{ fontSize: 17, lineHeight: 1.65, maxWidth: '68ch', my: 2 }}>
          {block.text}
        </Typography>
      )

    case 'h':
      return (
        <Typography variant="h5" sx={{ fontWeight: 680, mt: 5, mb: 1.5, letterSpacing: '-.01em' }}>
          {block.text}
        </Typography>
      )

    case 'list':
      return (
        <Box component="ul" sx={{ pl: 2.5, my: 2, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          {block.items.map((item) => (
            <Typography component="li" key={item} sx={{ fontSize: 16.5, maxWidth: '66ch' }}>
              {item}
            </Typography>
          ))}
        </Box>
      )

    case 'steps':
      return <Steps items={block.items} />

    case 'code':
      return (
        <Box sx={{ my: 2 }}>
          <Code label={block.caption}>{block.text}</Code>
          {block.caption ? (
            <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{block.caption}</Typography>
          ) : null}
        </Box>
      )

    case 'note':
      return (
        <Alert severity={TONE[block.tone]} variant="outlined" sx={{ my: 3, borderRadius: 2 }}>
          <AlertTitle sx={{ fontWeight: 680 }}>{block.title}</AlertTitle>
          <Typography sx={{ fontSize: 15.5, maxWidth: '64ch' }}>{block.text}</Typography>
        </Alert>
      )

    case 'table':
      return (
        <TableContainer component={Paper} variant="outlined" sx={{ my: 3, borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {block.head.map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 700, color: 'text.secondary' }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {block.rows.map((row) => (
                <TableRow key={row.join('|')}>
                  {row.map((cell, i) => (
                    <TableCell key={i} sx={{ fontSize: 14.5, verticalAlign: 'top' }}>
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )

    case 'figure':
      return (
        <Paper variant="outlined" component="figure" sx={{ my: 3.5, mx: 0, borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ p: { xs: 1.5, md: 2.5 } }}>
            {block.name === 'sync-map' ? (
              <SyncMap />
            ) : block.name === 'project-tree' ? (
              <ProjectTree />
            ) : block.name === 'automation-ladder' ? (
              <AutomationLadder />
            ) : block.name === 'routine-form' ? (
              <RoutineForm />
            ) : block.name === 'token-drains' ? (
              <TokenDrains />
            ) : block.name === 'context-growth' ? (
              <ContextGrowth />
            ) : block.name === 'subagent-context' ? (
              <SubagentContext />
            ) : block.name === 'context-window' ? (
              <ContextWindow />
            ) : block.name === 'usage-report' ? (
              <UsageReport />
            ) : (
              <RegalFlow />
            )}
          </Box>
          <Typography
            component="figcaption"
            sx={{ borderTop: 1, borderColor: 'divider', px: 2.5, py: 1.5, fontSize: 13.5, color: 'text.secondary' }}
          >
            {block.caption}
          </Typography>
        </Paper>
      )

    case 'checklist':
      return <Checklist title={block.title} items={block.items} />

    case 'task':
      return <Task title={block.title} intro={block.intro} items={block.items} hint={block.hint} />

    case 'video':
      return <Videos title={block.title} items={block.items} />

    case 'platform':
      return <PlatformSwitch mac={block.mac} win={block.win} />

    case 'tabs':
      return <AgendaTabs items={block.items} />

    case 'links':
      return <Links title={block.title} items={block.items} />
  }
}
