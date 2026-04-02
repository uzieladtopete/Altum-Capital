import { cn } from '@/lib/utils'
import { TestimonialCard } from '@/components/ui/testimonial-card'

export function TestimonialsSection({
  title,
  description,
  testimonials,
  className,
}) {
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
            className="group flex w-max min-w-full animate-marquee-triple hover:[animation-play-state:paused]"
            style={{ '--duration': '48s', '--gap': '1rem', gap: 'var(--gap)' }}
          >
            {[0, 1, 2].map((strip) => (
              <div
                key={`strip-${strip}`}
                className="flex shrink-0"
                style={{ gap: 'var(--gap)' }}
              >
                {testimonials.map((testimonial, i) => (
                  <div key={`${strip}-${i}`} className="shrink-0 w-[320px]">
                    <TestimonialCard {...testimonial} />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-background to-transparent sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-l from-background to-transparent sm:block" />
        </div>
      </div>
    </section>
  )
}
