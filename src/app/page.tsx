export default function HomePage() {
  return (
    <section className="container py-16 md:py-24">
      <div className="max-w-3xl space-y-6">
        <span className="inline-flex rounded-full bg-[var(--surface-warm)] px-4 py-1 text-sm font-medium text-[var(--accent)]">
          Project Foundation
        </span>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Nutritionist Platform
          </h1>

          <p className="text-lg leading-8 text-[var(--muted-foreground)]">
            Professional fullstack platform foundation built with Next.js, Drizzle
            ORM, PostgreSQL, and a scalable modular architecture.
          </p>
        </div>
      </div>
    </section>
  );
}