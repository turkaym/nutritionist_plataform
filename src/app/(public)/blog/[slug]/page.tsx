import { PagePlaceholder } from "@/components/shared/page-placeholder";

type BlogPostPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;

    return (
        <PagePlaceholder
            title={`Artículo: ${slug}`}
            description="Dynamic blog post placeholder prepared for future CMS content rendering."
        />
    );
}