import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { EXAMPLES, MCP_CONFIG, MISSING, SETUP, TOOL_GROUPS, TRUST } from '../mcpPage'

function Kicker({ children }: { children: string }) {
  return (
    <Typography
      sx={{
        fontSize: 12,
        letterSpacing: '.14em',
        textTransform: 'uppercase',
        fontWeight: 700,
        color: 'text.disabled',
        mb: 1.5,
      }}
    >
      ▹ {children}
    </Typography>
  )
}

function Code({ children, dense = false }: { children: string; dense?: boolean }) {
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
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <Box
        component="pre"
        sx={{
          flex: '1 1 320px',
          m: 0,
          p: dense ? 1.5 : 2,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1.5,
          bgcolor: 'action.hover',
          fontFamily: 'ui-monospace, Menlo, monospace',
          fontSize: 13,
          lineHeight: 1.65,
          overflowX: 'auto',
        }}
      >
        {children}
      </Box>
      <Button size="small" variant="outlined" color="inherit" onClick={copy} sx={{ mt: 0.5 }}>
        {copied ? 'Zkopírováno' : 'Kopírovat'}
      </Button>
    </Box>
  )
}

/** Stránka o MCP serveru nad katalogem dek.cz — co umí a jak si ho zapojit. */
export default function McpPage() {
  const [tab, setTab] = useState(0)
  const setup = SETUP[tab]!

  return (
    <Box sx={{ maxWidth: 1080, mx: 'auto', px: { xs: 2.5, md: 4 }, py: { xs: 5, md: 8 } }}>
      <Kicker>Model Context Protocol</Kicker>
      <Typography
        variant="h3"
        component="h1"
        sx={{ fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1.05, fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}
      >
        Zeptej se na katalog vlastními slovy.
      </Typography>
      <Typography sx={{ color: 'text.secondary', mt: 2, maxWidth: '62ch', fontSize: 18 }}>
        Dá Claudovi nástroje, kterými si sám prohledá katalog dek.cz, zjistí cenu a dostupnost nebo
        projde sortiment po kategoriích. Bez klikání ve webu, bez kopírování kódů z tabulky do
        vyhledávání a zpátky.
      </Typography>

      <Box sx={{ mt: 3.5 }}>
        <Code>{MCP_CONFIG}</Code>
        <Typography sx={{ fontSize: 14, color: 'text.disabled', mt: 1.5 }}>
          Běží u tebe na počítači. Funguje s čímkoli, co umí MCP přes stdio. Zapojení ↓
        </Typography>
      </Box>

      <Box sx={{ mt: 7 }} id="examples">
        <Kicker>Příklady</Kicker>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 660, letterSpacing: '-.02em', mb: 2.5 }}>
          Zeptej se svého asistenta
        </Typography>
        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
          {EXAMPLES.map((example, i) => (
            <Box
              key={example.prompt}
              sx={{
                display: 'flex',
                gap: 1.5,
                alignItems: 'baseline',
                p: 2.25,
                borderBottom: i < EXAMPLES.length - 1 ? 1 : 0,
                borderColor: 'divider',
                flexWrap: 'wrap',
              }}
            >
              <Typography sx={{ color: 'primary.main', fontWeight: 700 }}>›</Typography>
              <Typography sx={{ flex: '1 1 320px', fontSize: 17 }}>{example.prompt}</Typography>
              <Typography
                sx={{
                  fontSize: 11,
                  letterSpacing: '.08em',
                  fontWeight: 700,
                  color: 'text.disabled',
                  whiteSpace: 'nowrap',
                }}
              >
                {example.flow.join(' › ')}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 7 }}>
        <Kicker>Co to umí</Kicker>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 660, letterSpacing: '-.02em' }}>
          Pět nástrojů, nic víc
        </Typography>
        <Typography sx={{ color: 'text.secondary', mt: 1, maxWidth: '64ch' }}>
          Claude sáhne jen po tom, co je tady. Žádný z nástrojů nikam nezapisuje — server umí jen číst.
        </Typography>

        <Box sx={{ mt: 3 }}>
          {TOOL_GROUPS.map((group, i) => (
            <Box
              key={group.title}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '48px minmax(0, 1fr) minmax(0, 1fr)' },
                gap: 2,
                py: 3,
                borderTop: 1,
                borderColor: 'divider',
              }}
            >
              <Typography
                sx={{ color: 'text.disabled', fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontSize: 14 }}
              >
                {String(i + 1).padStart(2, '0')}
              </Typography>
              <Box>
                <Typography sx={{ fontWeight: 660, fontSize: 19, letterSpacing: '-.01em' }}>
                  {group.title}
                </Typography>
                <Typography sx={{ color: 'text.secondary', mt: 0.75 }}>{group.summary}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', alignContent: 'flex-start' }}>
                {group.tools.map((tool) => (
                  <Chip
                    key={tool}
                    size="small"
                    label={tool}
                    variant="outlined"
                    sx={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12, height: 24 }}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 7 }}>
        <Kicker>Zapojení</Kicker>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 660, letterSpacing: '-.02em' }}>
          Hotovo za pár minut
        </Typography>
        <Tabs
          value={tab}
          onChange={(_, v: number) => setTab(v)}
          sx={{ borderBottom: 1, borderColor: 'divider', mt: 2, mb: 3 }}
        >
          {SETUP.map((s) => (
            <Tab key={s.client} label={s.client} />
          ))}
        </Tabs>
        <Typography sx={{ color: 'text.secondary', mb: 2, maxWidth: '64ch' }}>{setup.intro}</Typography>
        <Code>{setup.code}</Code>
        {setup.after && (
          <>
            <Typography sx={{ color: 'text.secondary', mt: 2.5, mb: 2, maxWidth: '64ch' }}>
              {setup.after}
            </Typography>
            <Code dense>{MCP_CONFIG}</Code>
          </>
        )}
      </Box>

      <Box sx={{ mt: 7 }}>
        <Kicker>Co vidí a co ne</Kicker>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 660, letterSpacing: '-.02em', mb: 2.5 }}>
          Čte veřejný katalog, nic jiného
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
          }}
        >
          {TRUST.map((card) => (
            <Box key={card.title} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2.5 }}>
              <Typography sx={{ fontWeight: 650 }}>{card.title}</Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 15, mt: 0.75 }}>{card.body}</Typography>
            </Box>
          ))}
        </Box>

        <Typography
          sx={{
            fontSize: 11,
            letterSpacing: '.08em',
            textTransform: 'uppercase',
            fontWeight: 700,
            color: 'text.disabled',
            mt: 4,
            mb: 1,
          }}
        >
          Co tam nenajdeš
        </Typography>
        {MISSING.map((item) => (
          <Box
            key={item}
            sx={{
              pl: 2.25,
              mt: 0.75,
              position: 'relative',
              color: 'text.secondary',
              fontSize: 15,
              maxWidth: '74ch',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 2,
                top: '.6em',
                width: 5,
                height: 5,
                borderRadius: '50%',
                bgcolor: 'text.disabled',
              },
            }}
          >
            {item}
          </Box>
        ))}
      </Box>
    </Box>
  )
}
