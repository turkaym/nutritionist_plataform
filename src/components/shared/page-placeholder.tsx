type PagePlaceholderProps = {
    title: string;
    description: string;
};

export function PagePlaceholder({
    title,
    description,
}: PagePlaceholderProps) {
    return (
        <section className="container py-16 md:py-24">
            <div className="max-w-3xl space-y-4">
                <span className="inline-flex rounded-full bg-[var(--surface-warm)] px-4 py-1 text-sm font-medium text-[var(--accent)]">
                    Foundation Placeholder
                </span>

                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                    {title}
                </h1>

                <p className="text-lg leading-8 text-[var(--muted-foreground)]">
                    {description}
                </p>
            </div>
        </section>
    );
}