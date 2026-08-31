import { useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { CATEGORIES, GUIDES, LEVEL_LABEL, LINKS, RULES, START_HERE, type Card as KbCard } from '../kb'

const LEVEL_COLOR = { zaklad: 'success', stredni: 'primary', pokrocile: 'warning' } as const

function Card({ card }: { card: KbCard }) {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        minWidth: 0,
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline', flexWrap: 'wrap' }}>
        <Typography sx={{ fontWeight: 650, fontSize: 17, letterSpacing: '-.01em', flex: '1 1 auto' }}>
          {card.title}
        </Typography>
        {card.level && (
          <Chip
            size="small"
            variant="outlined"
            color={LEVEL_COLOR[card.level]}
            label={LEVEL_LABEL[card.level]}
            sx={{ height: 20, fontSize: 11, fontWeight: 650 }}
          />
        )}
      </Box>

      <Typography sx={{ color: 'text.secondary', fontSize: 15 }}>{card.summary}</Typography>

      {card.needs && card.needs.length > 0 && (
        <Box sx={{ mt: 0.5 }}>
          <Typography sx={{ fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', color: 'text.disabled', fontWeight: 700 }}>
            Potřebuješ
          </Typography>
          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{card.needs.join(' · ')}</Typography>
        </Box>
      )}

      {card.gives && card.gives.length > 0 && (
        <Box>
          <Typography sx={{ fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', color: 'text.disabled', fontWeight: 700 }}>
            Vypadne
          </Typography>
          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{card.gives.join(' · ')}</Typography>
        </Box>
      )}

      {card.minutes != null && (
        <Typography sx={{ fontSize: 13, color: 'text.disabled', mt: 'auto', pt: 1 }}>
          zhruba {card.minutes} min, když to děláš poprvé
        </Typography>
      )}
    </Box>
  )
}

function Grid({ cards }: { cards: KbCard[] }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' },
      }}
    >
      {cards.map((card) => (
        <Card key={card.title} card={card} />
      ))}
    </Box>
  )
}

/**
 * Rozcestník pro tým — co si odnesli z workshopu a k čemu se budou vracet.
 * Jedna stránka, žádné přihlašování, nic k instalaci.
 */
export default function KnowledgeBase() {
  const [tab, setTab] = useState(0)
  const category = CATEGORIES[tab]!

  return (
    <Box sx={{ maxWidth: 1180, mx: 'auto', px: { xs: 2.5, md: 4 }, py: { xs: 4, md: 6 } }}>
      <Typography variant="overline" sx={{ color: 'text.disabled', fontSize: 12 }}>
        DEK
      </Typography>
      <Typography variant="h4" component="h1" sx={{ mt: 0.5 }}>
        Claude v naší práci
      </Typography>
      <Typography sx={{ color: 'text.secondary', mt: 1.5, maxWidth: '68ch' }}>
        Co si tým odnesl z workshopu a k čemu se vracet, až bude potřeba. Úlohy jsou psané tak,
        aby šly zadat rovnou — je u nich, co Claude dostane na vstupu a co má vypadnout. Časy
        platí pro člověka, který to dělá poprvé.
      </Typography>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 660, mb: 2 }}>
          Začni tady
        </Typography>
        <Grid cards={START_HERE} />
      </Box>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 660 }}>
          Úlohy podle agendy
        </Typography>
        <Tabs
          value={tab}
          onChange={(_, v: number) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, mt: 1 }}
        >
          {CATEGORIES.map((c) => (
            <Tab key={c.id} label={c.label} />
          ))}
        </Tabs>
        <Grid cards={category.cards} />
      </Box>

      {GUIDES.map((guide) => (
        <Box key={guide.title} sx={{ mt: 6 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 660 }}>
            {guide.title}
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 1, maxWidth: '74ch' }}>{guide.intro}</Typography>

          <Box sx={{ mt: 2.5, border: 1, borderColor: 'divider', borderRadius: 2 }}>
            {guide.steps.map((step, i) => (
              <Box
                key={step.title}
                sx={{ p: 2.5, borderBottom: i < guide.steps.length - 1 ? 1 : 0, borderColor: 'divider' }}
              >
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'baseline' }}>
                  <Typography
                    sx={{ color: 'text.disabled', fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontSize: 14 }}
                  >
                    {i + 1}.
                  </Typography>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 650 }}>{step.title}</Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 15, mt: 0.5, maxWidth: '74ch' }}>
                      {step.body}
                    </Typography>
                    {step.code && (
                      <Box
                        component="pre"
                        sx={{
                          mt: 1.5,
                          mb: 0,
                          p: 1.75,
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 1,
                          bgcolor: 'action.hover',
                          fontFamily: 'ui-monospace, Menlo, monospace',
                          fontSize: 12.5,
                          lineHeight: 1.6,
                          overflowX: 'auto',
                        }}
                      >
                        {step.code}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          {guide.limits && guide.limits.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography
                sx={{ fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', color: 'text.disabled', fontWeight: 700 }}
              >
                Co tím nedostaneš
              </Typography>
              {guide.limits.map((limit) => (
                <Box
                  key={limit}
                  sx={{
                    pl: 2.25,
                    mt: 0.75,
                    position: 'relative',
                    fontSize: 14,
                    color: 'text.secondary',
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
                  {limit}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ))}

      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 660, mb: 2 }}>
          Pravidla, která platí vždycky
        </Typography>
        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
          {RULES.map((rule, i) => (
            <Box
              key={rule.title}
              sx={{ p: 2.5, borderBottom: i < RULES.length - 1 ? 1 : 0, borderColor: 'divider' }}
            >
              <Typography sx={{ fontWeight: 650 }}>{rule.title}</Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 15, mt: 0.5, maxWidth: '78ch' }}>
                {rule.body}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 660, mb: 2 }}>
          Kam dál
        </Typography>
        {LINKS.map((link) => (
          <Box key={link.href} sx={{ mb: 1.5 }}>
            <Link
              href={link.href}
              target="_blank"
              rel="noreferrer"
              sx={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
            >
              {link.label}
              <OpenInNewIcon sx={{ fontSize: 15 }} />
            </Link>
            {link.note && (
              <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{link.note}</Typography>
            )}
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 5 }} />
      <Typography sx={{ fontSize: 13, color: 'text.disabled' }}>
        Tahle stránka je veřejná — nejsou v ní žádná firemní data ani jména, jen postupy.
      </Typography>
    </Box>
  )
}
