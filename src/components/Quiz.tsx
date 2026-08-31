import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import LinearProgress from '@mui/material/LinearProgress'
import Radio from '@mui/material/Radio'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { MAX_POINTS, QUESTIONS, outcomeFor, scoreOf, summaryOf, type QuizAnswers } from '../quiz'

const KEY = 'runsheet.quiz.v1'

function load(): QuizAnswers {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as QuizAnswers
  } catch {
    /* prázdný nebo zakázaný storage není důvod kvíz nespustit */
  }
  return { name: '', picks: {} }
}

export default function Quiz() {
  const [answers, setAnswers] = useState<QuizAnswers>(load)
  const [done, setDone] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(answers))
    } catch {
      /* neuloží se — kvíz i tak dojede */
    }
  }, [answers])

  const pick = (questionId: string, index: number, multi: boolean) => {
    setAnswers((a) => {
      const current = a.picks[questionId] ?? []
      const next = multi
        ? current.includes(index)
          ? current.filter((i) => i !== index)
          : [...current, index]
        : [index]
      return { ...a, picks: { ...a.picks, [questionId]: next } }
    })
  }

  const answered = QUESTIONS.filter((q) => (answers.picks[q.id] ?? []).length > 0).length
  const complete = answered === QUESTIONS.length
  const points = scoreOf(answers)
  const outcome = outcomeFor(points)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summaryOf(answers))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  if (done) {
    return (
      <Box sx={{ maxWidth: '58ch', mx: 'auto', px: 3, py: 6 }}>
        <Typography variant="overline" sx={{ color: 'text.disabled', fontSize: 12 }}>
          Hotovo
        </Typography>
        <Typography variant="h4" component="h1" sx={{ mt: 0.5 }}>
          {outcome.level}
        </Typography>
        <Typography sx={{ color: 'text.secondary', mt: 1 }}>
          {points} z {MAX_POINTS} bodů. Není to známka — slouží to k tomu, aby tě večer nezdržoval
          ani neutopil.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="overline" sx={{ color: 'text.disabled', fontSize: 12 }}>
          Tvůj díl pro cvičení
        </Typography>
        <Typography sx={{ fontWeight: 650, fontSize: 18, mt: 0.5 }}>{outcome.slice}</Typography>
        <Typography sx={{ color: 'text.secondary', mt: 1 }}>{outcome.advice}</Typography>

        <Divider sx={{ my: 3 }} />

        <Typography sx={{ fontSize: 14, color: 'text.secondary', mb: 1.5 }}>
          Pošli výsledek Martinovi — nikam se sám neodesílá, zůstal jen v tomhle prohlížeči.
        </Typography>
        <Box
          component="pre"
          sx={{
            m: 0,
            p: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'action.hover',
            fontFamily: 'ui-monospace, Menlo, monospace',
            fontSize: 13,
            whiteSpace: 'pre-wrap',
          }}
        >
          {summaryOf(answers)}
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" onClick={copy}>
            {copied ? 'Zkopírováno' : 'Zkopírovat výsledek'}
          </Button>
          <Button variant="outlined" color="inherit" onClick={() => setDone(false)}>
            Zpět k odpovědím
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: '62ch', mx: 'auto', px: 3, py: 5 }}>
      <Typography variant="overline" sx={{ color: 'text.disabled', fontSize: 12 }}>
        Claude Cowork — workshop pro DEK
      </Typography>
      <Typography variant="h4" component="h1" sx={{ mt: 0.5 }}>
        Než začneme
      </Typography>
      <Typography sx={{ color: 'text.secondary', mt: 1.5 }}>
        Osm otázek, pár minut. Není to test a nikdo kromě tebe a Martina výsledek neuvidí — jde
        o to, abys večer dostal díl práce, který ti sedne. Kdo toho umí víc, dostane těžší kus.
      </Typography>

      <TextField
        label="Jméno"
        size="small"
        fullWidth
        sx={{ mt: 3 }}
        value={answers.name}
        onChange={(e) => setAnswers((a) => ({ ...a, name: e.target.value }))}
      />

      <Box sx={{ mt: 4 }}>
        <LinearProgress
          variant="determinate"
          value={(answered / QUESTIONS.length) * 100}
          sx={{ mb: 1 }}
        />
        <Typography sx={{ fontSize: 13, color: 'text.disabled' }}>
          {answered} z {QUESTIONS.length} zodpovězeno
        </Typography>
      </Box>

      {QUESTIONS.map((question, qi) => {
        const picks = answers.picks[question.id] ?? []
        return (
          <Box key={question.id} sx={{ mt: 4 }}>
            <Typography sx={{ fontWeight: 650 }}>
              {qi + 1}. {question.prompt}
            </Typography>
            {question.multi && (
              <Typography sx={{ fontSize: 13, color: 'text.disabled', mt: 0.25 }}>
                Můžeš vybrat víc odpovědí
              </Typography>
            )}
            <Box sx={{ mt: 1 }}>
              {question.choices.map((choice, ci) => {
                const selected = picks.includes(ci)
                return (
                  <Box
                    key={ci}
                    component="label"
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1,
                      py: 0.9,
                      px: 1,
                      ml: -1,
                      borderRadius: 1,
                      cursor: 'pointer',
                      bgcolor: selected
                        ? (t) => `color-mix(in srgb, ${t.palette.primary.main} 9%, transparent)`
                        : 'transparent',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    {question.multi ? (
                      <Checkbox
                        size="small"
                        checked={selected}
                        onChange={() => pick(question.id, ci, true)}
                        sx={{ p: 0.25, mt: '1px' }}
                      />
                    ) : (
                      <Radio
                        size="small"
                        checked={selected}
                        onChange={() => pick(question.id, ci, false)}
                        sx={{ p: 0.25, mt: '1px' }}
                      />
                    )}
                    <Typography sx={{ flex: 1 }}>{choice.label}</Typography>
                  </Box>
                )
              })}
            </Box>
          </Box>
        )
      })}

      <Box sx={{ mt: 5, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button variant="contained" disabled={!complete} onClick={() => setDone(true)}>
          Vyhodnotit
        </Button>
        {!complete && (
          <Typography sx={{ fontSize: 14, color: 'text.disabled' }}>
            Zbývá {QUESTIONS.length - answered} {QUESTIONS.length - answered === 1 ? 'otázka' : 'otázky'}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
