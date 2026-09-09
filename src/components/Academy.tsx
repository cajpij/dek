import { useEffect, useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import LinearProgress from '@mui/material/LinearProgress'
import InputBase from '@mui/material/InputBase'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import {
  COURSES,
  UPCOMING,
  courseMinutes,
  findCourse,
  findLesson,
  formatDuration,
  plural,
  type Course,
  type Lesson,
} from '../academy'
import { academyHref, goAcademy, readAcademyRoute, type AcademyRoute } from '../lib/academyRoute'
import { hledej, vyrizni, zvyrazni, type Vysledek } from '../lib/hledani'
import { useProgress } from '../lib/academyProgress'
import BlockView from './AcademyBlocks'

/* --------------------------------------------------------------- shell */

function Wordmark() {
  return (
    <Link
      href={academyHref({ view: 'list' })}
      underline="none"
      sx={{ display: 'inline-flex', alignItems: 'baseline', gap: 0.75, color: 'text.primary' }}
    >
      <Typography sx={{ fontWeight: 800, letterSpacing: '-.02em', fontSize: 19 }}>DEK</Typography>
      <Typography sx={{ fontWeight: 450, letterSpacing: '-.01em', fontSize: 19, color: 'text.secondary' }}>
        Academy
      </Typography>
    </Link>
  )
}

function Crumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.75, mb: 2 }}>
      {items.map((item, i) => (
        <Box key={item.label} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
          {i > 0 ? (
            <Typography sx={{ color: 'text.disabled', fontSize: 13.5 }} aria-hidden>
              /
            </Typography>
          ) : null}
          {item.href ? (
            <Link href={item.href} underline="hover" sx={{ fontSize: 13.5, color: 'text.secondary' }}>
              {item.label}
            </Link>
          ) : (
            <Typography sx={{ fontSize: 13.5, color: 'text.disabled' }}>{item.label}</Typography>
          )}
        </Box>
      ))}
    </Box>
  )
}

/**
 * Hledání nad celou akademií.
 *
 * Sedí v hlavičce, takže je po ruce i uprostřed lekce. Klávesa „/“ do něj
 * skočí odkudkoli — kdo hledá, obvykle nesahá po myši.
 */
function Hledatko({ vychozi }: { vychozi?: string }) {
  const [q, setQ] = useState(vychozi ?? '')
  const pole = useRef<HTMLInputElement>(null)

  useEffect(() => setQ(vychozi ?? ''), [vychozi])

  useEffect(() => {
    const naKlavesu = (e: KeyboardEvent) => {
      const kam = e.target as HTMLElement | null
      const pise = kam && (kam.tagName === 'INPUT' || kam.tagName === 'TEXTAREA' || kam.isContentEditable)
      if (e.key === '/' && !pise && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        pole.current?.focus()
      }
    }
    window.addEventListener('keydown', naKlavesu)
    return () => window.removeEventListener('keydown', naKlavesu)
  }, [])

  return (
    <Box
      component="form"
      role="search"
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault()
        const dotaz = q.trim()
        if (dotaz) goAcademy({ view: 'search', q: dotaz })
      }}
      sx={{ flex: '1 1 auto', maxWidth: 380, minWidth: { xs: 0, sm: 200 } }}
    >
      <InputBase
        inputRef={pole}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setQ('')
            pole.current?.blur()
          }
        }}
        placeholder="Hledat v akademii…"
        inputProps={{ 'aria-label': 'Hledat v akademii' }}
        title="Zkratka: / odkudkoli"

        sx={{
          width: '100%',
          px: 1.5,
          py: 0.5,
          fontSize: 14,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1.5,
          bgcolor: 'background.paper',
          '&:focus-within': { borderColor: 'primary.main' },
        }}
      />
    </Box>
  )
}

function Shell({ children, dotaz }: { children: React.ReactNode; dotaz?: string }) {
  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
      <Link
        href="#obsah"
        sx={{
          position: 'absolute',
          left: 12,
          top: -48,
          zIndex: 3,
          px: 1.5,
          py: 1,
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'primary.main',
          borderRadius: 1,
          fontSize: 14,
          '&:focus': { top: 12 },
        }}
      >
        Přeskočit na obsah
      </Link>
      <Box
        component="header"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          zIndex: 2,
          bgcolor: 'background.default',
        }}
      >
        <Box
          sx={{
            maxWidth: 1180,
            mx: 'auto',
            px: { xs: 2.5, md: 4 },
            py: 1.75,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Wordmark />
          <Hledatko vychozi={dotaz} />
          <Link
            href="#"
            underline="hover"
            sx={{ fontSize: 14, color: 'text.secondary', display: { xs: 'none', md: 'block' }, flexShrink: 0 }}
          >
            Program dne (pro lektora)
          </Link>
        </Box>
      </Box>
      <Box component="main" id="obsah">
        {children}
      </Box>
      <Box
        component="footer"
        sx={{ borderTop: 1, borderColor: 'divider', mt: 10, py: 4, px: { xs: 2.5, md: 4 } }}
      >
        <Box sx={{ maxWidth: 1180, mx: 'auto' }}>
          <Typography sx={{ fontSize: 13.5, color: 'text.disabled', maxWidth: '70ch' }}>
            Interní materiály DEK. Lekce vznikají z workshopů — když v nich něco chybí nebo nesedí,
            řekni to lektorovi a doplní se.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

/* ---------------------------------------------------------------- meta */

function Meta({ course, done }: { course: Course; done?: number }) {
  const total = course.lessons.length
  const inRoom = courseMinutes(course, 'v sále')
  const after = courseMinutes(course, 'potom')
  const parts = [
    plural(total, 'lekce', 'lekce', 'lekcí'),
    `v sále ${formatDuration(inRoom)}`,
    `potom ${formatDuration(after)}`,
    course.level,
  ]
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
      {parts.map((p, i) => (
        <Box key={p} sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
          {i > 0 ? (
            <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'text.disabled' }} aria-hidden />
          ) : null}
          <Typography sx={{ fontSize: 14 }}>{p}</Typography>
        </Box>
      ))}
      {done ? <Chip size="small" label={`${done}/${total} hotovo`} sx={{ ml: 0.5 }} /> : null}
    </Box>
  )
}

/* ------------------------------------------------------------- přehled */

function CourseCard({ course, done }: { course: Course; done: number }) {
  const total = course.lessons.length
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.25,
        height: '100%',
        transition: 'border-color .15s',
        '&:hover': { borderColor: 'text.disabled' },
      }}
    >
      <Link
        href={academyHref({ view: 'course', course: course.slug })}
        underline="none"
        sx={{ color: 'text.primary' }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-.01em' }}>
          {course.title}
        </Typography>
      </Link>
      <Typography sx={{ color: 'text.secondary', fontSize: 15, flex: 1 }}>{course.summary}</Typography>
      <Meta course={course} done={done} />
      {done > 0 ? (
        <LinearProgress variant="determinate" value={(done / total) * 100} sx={{ mt: 0.5 }} />
      ) : null}
      <Button
        href={academyHref({ view: 'course', course: course.slug })}
        variant="contained"
        sx={{ alignSelf: 'flex-start', mt: 1 }}
      >
        {done > 0 ? 'Pokračovat' : 'Otevřít kurz'}
      </Button>
    </Paper>
  )
}

function UpcomingCard({ title, summary, note }: { title: string; summary: string; note: string }) {
  return (
    <Paper
      variant="outlined"
      sx={{ borderRadius: 2, p: 3, display: 'flex', flexDirection: 'column', gap: 1.25, height: '100%' }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.disabled', letterSpacing: '-.01em' }}>
        {title}
      </Typography>
      <Typography sx={{ color: 'text.disabled', fontSize: 15, flex: 1 }}>{summary}</Typography>
      <Chip size="small" variant="outlined" label={note} sx={{ alignSelf: 'flex-start' }} />
    </Paper>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mt: 6 }}>
      <Typography
        sx={{
          fontSize: 12,
          letterSpacing: '.14em',
          textTransform: 'uppercase',
          fontWeight: 700,
          color: 'text.disabled',
          mb: 2,
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 2.5,
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

function CourseList() {
  const { doneCount } = useProgress()
  const sections = useMemo(() => {
    const map = new Map<string, Course[]>()
    for (const c of COURSES) {
      const list = map.get(c.section) ?? []
      list.push(c)
      map.set(c.section, list)
    }
    return [...map.entries()]
  }, [])

  return (
    <Box sx={{ maxWidth: 1180, mx: 'auto', px: { xs: 2.5, md: 4 }, pt: { xs: 5, md: 7 } }}>
      <Typography
        variant="h3"
        component="h1"
        tabIndex={-1}
        sx={{ fontWeight: 750, letterSpacing: '-.03em', fontSize: 'clamp(2rem, 5vw, 3rem)' }}
      >
        Kurzy
      </Typography>
      <Typography sx={{ color: 'text.secondary', mt: 1.5, maxWidth: '62ch', fontSize: 17.5 }}>
        Krátké lekce, které se dají projít u vlastního počítače. Každá končí něčím, co si zkusíš na
        vlastních datech — ne testem.
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', mt: 2 }}>
        <Typography sx={{ fontSize: 13.5, color: 'text.disabled' }}>Lekce jsou označené podle toho, kdy na ně dojde:</Typography>
        <Chip size="small" color="primary" label="v sále" sx={{ height: 20, fontSize: 11.5 }} />
        <Chip size="small" variant="outlined" label="potom" sx={{ height: 20, fontSize: 11.5 }} />
      </Box>

      {sections.map(([title, courses]) => (
        <Section key={title} title={title}>
          {courses.map((c) => (
            <CourseCard key={c.slug} course={c} done={doneCount(c.slug, c.lessons)} />
          ))}
        </Section>
      ))}

      {UPCOMING.length > 0 ? (
        <Section title="Připravujeme">
          {UPCOMING.map((u) => (
            <UpcomingCard key={u.title} title={u.title} summary={u.summary} note={u.note} />
          ))}
        </Section>
      ) : null}
    </Box>
  )
}

/* --------------------------------------------------------- detail kurzu */

const TRACK_COLOR = { 'v sále': 'primary', 'potom': 'default' } as const

function TrackChip({ track }: { track?: 'v sále' | 'potom' }) {
  if (!track) return null
  return (
    <Chip
      size="small"
      variant={track === 'v sále' ? 'filled' : 'outlined'}
      color={TRACK_COLOR[track]}
      label={track}
      sx={{ height: 20, fontSize: 11.5 }}
    />
  )
}

function LessonRow({
  course,
  lesson,
  index,
  done,
}: {
  course: Course
  lesson: Lesson
  index: number
  done: boolean
}) {
  return (
    <Box
      component="li"
      sx={{
        display: 'grid',
        gridTemplateColumns: '32px 1fr auto',
        gap: 2,
        alignItems: 'baseline',
        py: 1.75,
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Typography
        sx={{ fontSize: 13, color: done ? 'success.main' : 'text.disabled', fontVariantNumeric: 'tabular-nums' }}
      >
        {done ? '✓' : String(index + 1).padStart(2, '0')}
      </Typography>
      <Box>
        <Link
          href={academyHref({ view: 'lesson', course: course.slug, lesson: lesson.slug })}
          underline="hover"
          sx={{ color: 'text.primary', fontWeight: 600, fontSize: 16 }}
        >
          {lesson.title}
        </Link>
        <Typography sx={{ color: 'text.secondary', fontSize: 14.5, mt: 0.25, maxWidth: '64ch' }}>
          {lesson.summary}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TrackChip track={lesson.track} />
        {lesson.kind === 'zadání' ? <Chip size="small" color="primary" variant="outlined" label="zadání" /> : null}
        <Typography sx={{ fontSize: 13.5, color: 'text.disabled', whiteSpace: 'nowrap' }}>
          {lesson.minutes} min
        </Typography>
      </Box>
    </Box>
  )
}

function CoursePage({ course }: { course: Course }) {
  const { isDone, doneCount } = useProgress()
  const done = doneCount(course.slug, course.lessons)
  const first = course.lessons[0]!
  const next = course.lessons.find((l) => !isDone(course.slug, l.slug)) ?? first

  return (
    <Box sx={{ maxWidth: 1180, mx: 'auto', px: { xs: 2.5, md: 4 }, pt: { xs: 3.5, md: 5 } }}>
      <Crumbs items={[{ label: 'Kurzy', href: academyHref({ view: 'list' }) }, { label: course.title }]} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 320px' }, gap: { xs: 4, md: 7 } }}>
        <Box>
          <Typography
            variant="h3"
            component="h1"
        tabIndex={-1}
            sx={{ fontWeight: 750, letterSpacing: '-.03em', fontSize: 'clamp(1.9rem, 4.4vw, 2.7rem)' }}
          >
            {course.title}
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 2, maxWidth: '64ch', fontSize: 17.5 }}>
            {course.intro}
          </Typography>
          <Box sx={{ mt: 2.5 }}>
            <Meta course={course} done={done} />
          </Box>
          <Button
            href={academyHref({ view: 'lesson', course: course.slug, lesson: next.slug })}
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
          >
            {done > 0 ? `Pokračovat: ${next.title}` : 'Začít kurz'}
          </Button>

          <Typography variant="h5" sx={{ fontWeight: 700, mt: 6, mb: 2 }}>
            Co se naučíš
          </Typography>
          <Box
            component="ul"
            sx={{
              m: 0,
              p: 0,
              listStyle: 'none',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 1.25,
            }}
          >
            {course.learn.map((item) => (
              <Box component="li" key={item} sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                <Box component="span" sx={{ color: 'success.main', fontWeight: 700, lineHeight: 1.6 }} aria-hidden>
                  ✓
                </Box>
                <Typography sx={{ fontSize: 15.5 }}>{item}</Typography>
              </Box>
            ))}
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 700, mt: 6, mb: 1 }}>
            Obsah kurzu
          </Typography>
          {course.modules.map((mod) => {
            const lessons = course.lessons.filter((l) => l.module === mod.key)
            if (lessons.length === 0) return null
            return (
              <Box key={mod.key} sx={{ mt: 3.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 17 }}>{mod.title}</Typography>
                  <Typography sx={{ fontSize: 13.5, color: 'text.disabled' }}>
                    {plural(lessons.length, 'lekce', 'lekce', 'lekcí')}
                  </Typography>
                </Box>
                <Typography sx={{ color: 'text.secondary', fontSize: 15, mt: 0.5, maxWidth: '64ch' }}>
                  {mod.summary}
                </Typography>
                <Box component="ol" sx={{ listStyle: 'none', m: 0, mt: 1.5, p: 0 }}>
                  {lessons.map((lesson) => (
                    <LessonRow
                      key={lesson.slug}
                      course={course}
                      lesson={lesson}
                      index={course.lessons.indexOf(lesson)}
                      done={isDone(course.slug, lesson.slug)}
                    />
                  ))}
                </Box>
              </Box>
            )
          })}
        </Box>

        <Box>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, position: { md: 'sticky' }, top: { md: 88 } }}>
            <Typography
              sx={{
                fontSize: 11.5,
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: 'text.disabled',
                mb: 1.5,
              }}
            >
              Co k tomu potřebuješ
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2.25, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {course.prerequisites.map((p) => (
                <Typography component="li" key={p} sx={{ fontSize: 14.5, color: 'text.secondary' }}>
                  {p}
                </Typography>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

/* --------------------------------------------------------- detail lekce */

function LessonSidebar({ course, current }: { course: Course; current: Lesson }) {
  const { isDone } = useProgress()
  return (
    <Box component="nav" aria-label="Obsah kurzu" sx={{ position: { md: 'sticky' }, top: { md: 88 } }}>
      <Link
        href={academyHref({ view: 'course', course: course.slug })}
        underline="hover"
        sx={{ fontSize: 14, color: 'text.secondary', display: 'inline-block', py: 0.5 }}
      >
        ← {course.title}
      </Link>
      {course.modules.map((mod) => {
        const lessons = course.lessons.filter((l) => l.module === mod.key)
        if (lessons.length === 0) return null
        return (
          <Box key={mod.key} sx={{ mt: 3 }}>
            <Typography
              sx={{
                fontSize: 12.5,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: 'text.secondary',
                mb: 1,
              }}
            >
              {mod.title}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {lessons.map((lesson) => {
                const active = lesson.slug === current.slug
                const sekce = active
                  ? lesson.body.flatMap((b) => (b.kind === 'sekce' ? [b] : []))
                  : []
                return (
                  <Box key={lesson.slug} sx={{ display: 'contents' }}>
                  <Link
                    href={academyHref({ view: 'lesson', course: course.slug, lesson: lesson.slug })}
                    underline="none"
                    aria-current={active ? 'page' : undefined}
                    sx={{
                      display: 'flex',
                      gap: 1,
                      alignItems: 'baseline',
                      py: 0.9,
                      pl: 1.25,
                      borderLeft: 2,
                      borderColor: active ? 'primary.main' : 'divider',
                      color: active ? 'text.primary' : 'text.secondary',
                      fontWeight: active ? 650 : 400,
                      fontSize: 14.5,
                      '&:hover': { color: 'text.primary' },
                    }}
                  >
                    <Box
                      component="span"
                      sx={{ color: 'success.main', width: 12 }}
                      aria-label={isDone(course.slug, lesson.slug) ? 'hotovo' : undefined}
                      aria-hidden={isDone(course.slug, lesson.slug) ? undefined : true}
                    >
                      {isDone(course.slug, lesson.slug) ? '✓' : ''}
                    </Box>
                    {lesson.title}
                  </Link>
                  {sekce.map((s) => (
                    <Box
                      key={s.id}
                      component="button"
                      type="button"
                      onClick={() => {
                        const el = document.getElementById(s.id)
                        if (!el) return
                        const pred = window.scrollY
                        el.scrollIntoView({ behavior: 'smooth' })
                        // Plynulé rolování někde tiše neudělá nic. Když se po
                        // chvíli nic nepohne, doskoč natvrdo — odrážka, která
                        // po kliknutí nic neudělá, je horší než skok.
                        window.setTimeout(() => {
                          if (Math.abs(window.scrollY - pred) < 4) el.scrollIntoView()
                        }, 250)
                      }}
                      sx={{
                        font: 'inherit',
                        textAlign: 'left',
                        cursor: 'pointer',
                        bgcolor: 'transparent',
                        border: 0,
                        borderLeft: 2,
                        borderColor: 'divider',
                        color: 'text.secondary',
                        fontSize: 13.5,
                        py: 0.6,
                        pl: 3.5,
                        '&:hover': { color: 'text.primary' },
                        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 },
                      }}
                    >
                      · {s.titul}
                    </Box>
                  ))}
                  </Box>
                )
              })}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

function LessonPage({ course, lesson }: { course: Course; lesson: Lesson }) {
  const { isDone, toggle } = useProgress()
  const index = course.lessons.indexOf(lesson)
  const next = course.lessons[index + 1]
  const done = isDone(course.slug, lesson.slug)

  return (
    <Box sx={{ maxWidth: 1180, mx: 'auto', px: { xs: 2.5, md: 4 }, pt: { xs: 3.5, md: 5 } }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '256px 1fr' }, gap: { xs: 4, md: 6 } }}>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <LessonSidebar course={course} current={lesson} />
        </Box>

        <Box sx={{ minWidth: 0, maxWidth: 800 }}>
          <Box component="details" sx={{ display: { md: 'none' }, mb: 2.5, '& summary': { cursor: 'pointer', fontSize: 14.5, color: 'text.secondary', py: 1 } }}>
            <Box component="summary">Obsah kurzu — lekce {index + 1} z {course.lessons.length}</Box>
            <Box sx={{ pt: 1 }}>
              <LessonSidebar course={course} current={lesson} />
            </Box>
          </Box>
          <Crumbs
            items={[
              { label: 'Kurzy', href: academyHref({ view: 'list' }) },
              { label: course.title, href: academyHref({ view: 'course', course: course.slug }) },
              { label: lesson.title },
            ]}
          />
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap', mb: 1 }}>
            <Typography sx={{ fontSize: 13.5, color: 'text.secondary' }}>
              {`Lekce ${index + 1} z ${course.lessons.length}`}
            </Typography>
            <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'text.disabled' }} aria-hidden />
            <Typography sx={{ fontSize: 13.5, color: 'text.secondary' }}>{lesson.minutes} min čtení</Typography>
            <TrackChip track={lesson.track} />
          </Box>
          <Typography
            variant="h3"
            component="h1"
        tabIndex={-1}
            sx={{ fontWeight: 750, letterSpacing: '-.03em', fontSize: 'clamp(1.8rem, 4.2vw, 2.5rem)' }}
          >
            {lesson.title}
          </Typography>

          <Paper variant="outlined" sx={{ mt: 3, p: 2.5, borderRadius: 2, bgcolor: 'action.hover' }}>
            <Typography sx={{ fontWeight: 650, mb: 1 }}>Po téhle lekci budeš umět</Typography>
            <Box component="ul" sx={{ m: 0, pl: 2.25, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {lesson.outcomes.map((o) => (
                <Typography component="li" key={o} sx={{ fontSize: 15.5 }}>
                  {o}
                </Typography>
              ))}
            </Box>
          </Paper>

          {lesson.body.map((block, i) => (
            <BlockView key={i} block={block} />
          ))}

          <Divider sx={{ mt: 6 }} />
          <Box
            sx={{
              py: 3,
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant={done ? 'outlined' : 'contained'}
              color={done ? 'success' : 'primary'}
              onClick={() => toggle(course.slug, lesson.slug)}
              aria-pressed={done}
            >
              {done ? '✓ Hotovo (kliknutím zrušíš)' : 'Označit jako hotové'}
            </Button>
            {next ? (
              <Button
                href={academyHref({ view: 'lesson', course: course.slug, lesson: next.slug })}
                variant="text"
                sx={{ textAlign: 'right' }}
              >
                Další: {next.title} →
              </Button>
            ) : (
              <Button href={academyHref({ view: 'course', course: course.slug })} variant="text">
                Zpět na přehled kurzu
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

/* ------------------------------------------------------------- rozcestí */

function VysledekRadek({ v, dotaz }: { v: Vysledek; dotaz: string }) {
  const u = v.ukazka
  const kusy = u && u.od >= 0 ? zvyrazni(vyrizni(u.text, u.od, u.do), dotaz) : null
  return (
    <Box
      component="a"
      href={academyHref({ view: 'lesson', course: v.kurz.slug, lesson: v.lekce.slug })}
      sx={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        borderBottom: 1,
        borderColor: 'divider',
        py: 2.25,
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <Typography sx={{ fontSize: 12.5, color: 'text.disabled', letterSpacing: 0.3 }}>
        {v.kurz.title}
      </Typography>
      <Typography sx={{ fontSize: 17, fontWeight: 660, mt: 0.25 }}>{v.lekce.title}</Typography>
      {kusy && (
        <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.75, maxWidth: '78ch' }}>
          <Box component="span" sx={{ color: 'text.disabled', mr: 0.75 }}>
            {u!.puvod} ·{' '}
          </Box>
          {kusy.map((k, i) =>
            k.shoda ? (
              <Box
                key={i}
                component="mark"
                sx={{ bgcolor: 'warning.main', color: 'background.paper', px: 0.25, borderRadius: 0.5 }}
              >
                {k.text}
              </Box>
            ) : (
              <span key={i}>{k.text}</span>
            ),
          )}
        </Typography>
      )}
      <Typography sx={{ fontSize: 12.5, color: 'text.disabled', mt: 0.75 }}>
        {plural(v.zasahu, 'zmínka', 'zmínky', 'zmínek')} v lekci · {v.lekce.minutes} min
        {v.lekce.track ? ` · ${v.lekce.track}` : ''}
      </Typography>
    </Box>
  )
}

function SearchPage({ q }: { q: string }) {
  const vysledky = useMemo(() => hledej(q), [q])
  return (
    <Box sx={{ maxWidth: 1180, mx: 'auto', px: { xs: 2.5, md: 4 }, pt: 4, pb: 8 }}>
      <Crumbs items={[{ label: 'Kurzy', href: academyHref({ view: 'list' }) }, { label: 'Hledání' }]} />
      <Typography variant="h4" component="h1" tabIndex={-1} sx={{ mt: 1, outline: 'none' }}>
        {q}
      </Typography>
      <Typography sx={{ color: 'text.secondary', mt: 1 }}>
        {vysledky.length === 0
          ? 'Nic. Zkus jedno slovo místo věty — hledá se přes všechny lekce včetně obsahu souborů na rozkliknutí. Na diakritice nezáleží.'
          : `${plural(vysledky.length, 'lekce', 'lekce', 'lekcí')}, seřazeno podle toho, jak moc se to tam řeší.`}
      </Typography>
      <Box sx={{ mt: 3, borderTop: 1, borderColor: 'divider' }}>
        {vysledky.map((v) => (
          <VysledekRadek key={`${v.kurz.slug}/${v.lekce.slug}`} v={v} dotaz={q} />
        ))}
      </Box>
    </Box>
  )
}

function NotFound({ what }: { what: string }) {
  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', px: 3, py: 10 }}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {what} tady není
      </Typography>
      <Typography sx={{ color: 'text.secondary', mt: 1.5 }}>
        Odkaz nejspíš míří na lekci, která se ještě nepřipravila, nebo se přejmenovala.
      </Typography>
      <Button variant="contained" sx={{ mt: 3 }} onClick={() => goAcademy({ view: 'list' })}>
        Zpátky na kurzy
      </Button>
    </Box>
  )
}

/** DEK Academy — rozcestník kurzů, detail kurzu a stránka lekce na jedné adrese. */
export default function Academy() {
  const [route, setRoute] = useState<AcademyRoute>(() => readAcademyRoute())

  useEffect(() => {
    const onHash = () => {
      setRoute(readAcademyRoute())
      window.scrollTo({ top: 0 })
      // Po přepnutí lekce přenést fokus na nadpis, ať čtečka i klávesnice
      // začnou od začátku nové stránky a ne od tlačítka dole.
      window.setTimeout(() => {
        const h1 = document.querySelector<HTMLElement>('main h1')
        h1?.focus()
      }, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    const course = route.view === 'list' || route.view === 'search' ? undefined : findCourse(route.course)
    const lesson = route.view === 'lesson' && course ? findLesson(course, route.lesson) : undefined
    document.title = route.view === 'search'
      ? `${route.q} · Hledání · DEK Academy`
      : lesson
      ? `${lesson.title} · DEK Academy`
      : course
        ? `${course.title} · DEK Academy`
        : 'DEK Academy'
    return () => {
      document.title = 'Run-sheet'
    }
  }, [route])

  if (route.view === 'list') {
    return (
      <Shell>
        <CourseList />
      </Shell>
    )
  }

  if (route.view === 'search') {
    return (
      <Shell dotaz={route.q}>
        <SearchPage q={route.q} />
      </Shell>
    )
  }

  const course = findCourse(route.course)
  if (!course) {
    return (
      <Shell>
        <NotFound what="Kurz" />
      </Shell>
    )
  }

  if (route.view === 'course') {
    return (
      <Shell>
        <CoursePage course={course} />
      </Shell>
    )
  }

  const lesson = findLesson(course, route.lesson)
  if (!lesson) {
    return (
      <Shell>
        <NotFound what="Lekce" />
      </Shell>
    )
  }

  return (
    <Shell>
      <LessonPage course={course} lesson={lesson} />
    </Shell>
  )
}
