import { cn } from '@/lib/utils'
import { TestimonialCard } from '@/components/ui/testimonial-card'

export function TestimonialsSection({
  title,
  description,
  testimonials,
  className,
}) {
  const cards = testimonials.map((testimonial, i) => (
    <div key={i} className="shrink-0 w-[320px]">
      <TestimonialCard {...testimonial} />
    </div>
  ))

  return (
    <section
      className={cn(
        'bg-background text-foreground',
        'py-12 sm:py-24 md:py-32 px-0',
        className
      )}
    >
      <div className="mx-auto flex max-w-container flex-col items-center gap-4 text-center sm:gap-16">
        <div className="flex flex-col items-center gap-4 px-4 sm:gap-8">
          <h2 className="max-w-[720px] text-3xl font-semibold leading-tight sm:text-5xl sm:leading-tight font-serif">
            {title}
          </h2>
          <p className="text-base max-w-[600px] font-medium text-muted-foreground sm:text-xl">
            {description}
          </p>
        </div>

        <div className="relative w-full overflow-hidden">
          <div
            className="group flex animate-marquee hover:[animation-play-state:paused]"
            style={{ '--duration': '30s', '--gap': '1rem' }}
          >
            <div className="flex shrink-0" style={{ gap: 'var(--gap)' }}>
              {cards}
            </div>
            <div className="flex shrink-0" style={{ gap: 'var(--gap)', paddingLeft: 'var(--gap)' }}>
              {testimonials.map((testimonial, i) => (
                <div key={`dup-${i}`} className="shrink-0 w-[320px]">
                  <TestimonialCard {...testimonial} />
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-background sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-background sm:block" />
        </div>
      </div>
    </section>
  )
}
