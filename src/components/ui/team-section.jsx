import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Mail, Phone, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { getTeamAdvisors, subscribeToAdvisors } from '@/services/teamAdvisorsSupabase'
import { getOptimizedImageUrl } from '@/config/cloudinary'

const PLACEHOLDER_CARD = {
  name: '',
  role: '',
  bio: '',
  image: '/siguiente-asesora.png',
  skills: [],
  social: {},
  isPlaceholder: true,
}

/** Compara sin acentos para detectar a la dueña. */
function isJessicaHernandez(name) {
  const n = String(name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
  return n.includes('jessica') && n.includes('hernandez')
}

function defaultRoleForRow(row) {
  return isJessicaHernandez(row.name) ? 'Broker Associate' : 'Asesor inmobiliario'
}

/** Primera letra del nombre para avatar sin foto. */
function advisorInitial(name) {
  const t = String(name || '').trim()
  if (!t) return '?'
  const ch = [...t][0]
  return ch ? ch.toUpperCase() : '?'
}

function dbRowToCard(row) {
  return {
    name: row.name || '',
    role: defaultRoleForRow(row),
    bio: row.description || '',
    image: (row.image_url || '').trim(),
    skills: ['Residencial', 'Comercial', 'Inversión'],
    social: {
      email: row.email || '',
      phone: row.phone || '',
    },
  }
}

function TeamMemberCard({ member }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), {
    stiffness: 200,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), {
    stiffness: 200,
    damping: 30,
  })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2))
    mouseY.set((e.clientY - rect.top - rect.height / 2) / (rect.height / 2))
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const socials = [
    member.social?.phone
      ? { icon: Phone, label: 'Teléfono', href: `tel:${String(member.social.phone).replace(/\s+/g, '')}` }
      : null,
    member.social?.email
      ? { icon: Mail, label: 'Email', href: `mailto:${member.social.email}` }
      : null,
  ].filter(Boolean)

  const rawImage = (member.image || '').trim()
  const hasPhoto = !member.isPlaceholder && !!rawImage
  const imgSrc = rawImage.startsWith('http')
    ? getOptimizedImageUrl(rawImage, { width: 400 })
    : rawImage

  return (
    <div className="w-full max-w-[280px] h-full" style={{ perspective: 800 }}>
      <div
        style={{ willChange: 'transform' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative w-full h-full"
      >
        <Card className={`relative h-full overflow-hidden rounded-2xl border border-gray-200 shadow-sm transition-shadow duration-300 hover:shadow-xl ${member.isPlaceholder ? 'bg-gray-50' : 'bg-white'}`}>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/8 via-accent/4 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {!member.isPlaceholder && (
            <div className="absolute right-4 top-4 z-10 scale-0 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
              <Sparkles className="h-5 w-5 text-accent" aria-hidden />
            </div>
          )}

          <div className="relative z-10 flex h-full flex-col p-6">
            <div className="mb-4 flex justify-center">
              <div className="relative">
                {!member.isPlaceholder && (
                  <div
                    className="absolute -inset-2 rounded-full opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-60"
                    style={{ background: 'radial-gradient(circle, rgba(77,94,86,0.18), transparent)' }}
                  />
                )}
                <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-gray-100 bg-gray-50 p-1">
                  {member.isPlaceholder || hasPhoto ? (
                    <img
                      src={imgSrc}
                      alt={member.name || 'Próximo asesor'}
                      className="h-full w-full rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center rounded-full bg-accent/15 text-3xl font-bold text-accent transition-transform duration-300 group-hover:scale-105"
                      role="img"
                      aria-label={member.name ? `Inicial de ${member.name}` : 'Sin foto'}
                    >
                      {advisorInitial(member.name)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex h-full flex-1 flex-col text-center">
              {member.name && (
                <h3 className="mb-1 text-xl font-semibold tracking-tight text-gray-900 transition-transform duration-200 group-hover:scale-[1.03]">
                  {member.name}
                </h3>
              )}

              {member.role && (
                <Badge
                  variant="secondary"
                  className="mb-2 justify-center bg-accent/10 text-xs sm:text-sm font-bold normal-case tracking-normal text-accent px-2 py-0.5"
                >
                  {member.role}
                </Badge>
              )}

              {member.bio && <p className="mb-4 text-sm text-gray-500">{member.bio}</p>}

              {!!member.skills?.length && (
                <div className="mb-4 flex flex-wrap justify-center gap-1.5">
                  {member.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="border-gray-200 bg-gray-50 text-xs text-gray-600 transition-colors hover:bg-accent/5 hover:border-accent/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}

              {!!socials.length && (
                <div className="flex w-full min-w-0 flex-col items-center gap-2">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      title={social.label === 'Email' ? member.social?.email : undefined}
                      className="max-w-full text-gray-700 underline decoration-gray-300 underline-offset-2 transition-colors hover:text-accent hover:decoration-accent"
                    >
                      {social.label === 'Teléfono' ? (
                        <span className="inline-flex items-center gap-1.5 text-sm">
                          <Phone className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                          {member.social?.phone}
                        </span>
                      ) : (
                        <span className="inline-flex min-w-0 max-w-full items-center gap-1">
                          <Mail className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                          <span className="truncate text-[10px] sm:text-[11px] leading-tight">
                            {member.social?.email}
                          </span>
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              )}

              {member.isPlaceholder && (
                <div className="flex flex-1 items-center justify-center">
                  <Link to="/bolsa-de-trabajo">
                    <ShimmerButton className="shadow-2xl">
                      <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white lg:text-base">
                        Sé el siguiente →
                      </span>
                    </ShimmerButton>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export function TeamSection() {
  const [advisorCards, setAdvisorCards] = useState([])
  const [loaded, setLoaded] = useState(false)

  const refresh = useCallback(async () => {
    const rows = await getTeamAdvisors()
    setAdvisorCards(rows.map(dbRowToCard))
    setLoaded(true)
  }, [])

  useEffect(() => {
    refresh()
    const channel = subscribeToAdvisors(() => refresh())
    return () => { channel?.unsubscribe() }
  }, [refresh])

  const cards = [...advisorCards, PLACEHOLDER_CARD]

  return (
    <section aria-labelledby="team-heading" className="relative w-full overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute -right-24 -top-24 h-96 w-96 animate-pulse rounded-full bg-accent/10 blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 animate-pulse rounded-full bg-accent/8 blur-[100px] [animation-delay:2s]" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <h2
            id="team-heading"
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 mb-4"
          >
            Conoce a nuestros asesores
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-500">
            Un equipo comprometido en ayudarte a encontrar la mejor oportunidad inmobiliaria.
          </p>
        </div>

        <div className={`flex flex-wrap justify-center gap-8`}>
          {cards.map((member, index) => (
            <TeamMemberCard key={member.name || `placeholder-${index}`} member={member} />
          ))}
        </div>
      </div>
    </section>
  )
}
