import { useState } from 'react'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import type { Block } from '../academy'
import RegalFlow from './RegalFlow'

/** Blok kódu nebo cesty, který si člověk odnese přes schránku. */
function Code({ children }: { children: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', flexWrap: 'wrap', my: 1.5 }}>
      <Box
        component="pre"
        sx={{
          flex: '1 1 320px',
          m: 0,
          p: 1.75,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1.5,
          bgcolor: 'action.hover',
          fontFamily: 'ui-monospace, Menlo, monospace',
          fontSize: 13,
          lineHeight: 1.65,
          whiteSpace: 'pre-wrap',
          overflowX: 'auto',
        }}
      >
        {children}
      </Box>
      <Button size="small" variant="outlined" color="inherit" onClick={copy} sx={{ mt: 0.25 }}>
        {copied ? 'Zkopírováno' : 'Kopírovat'}
      </Button>
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

function Steps({ items }: { items: { title: string; body: string; code?: string }[] }) {
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
          <Code>{block.text}</Code>
          {block.caption ? (
            <Typography sx={{ fontSize: 13.5, color: 'text.disabled' }}>{block.caption}</Typography>
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
            <RegalFlow />
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
  }
}
