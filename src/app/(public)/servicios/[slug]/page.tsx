import { PagePlaceholder } from "@/components/shared/page-placeholder";

type ServiceDetailPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function ServiceDetailPage({
    params,
}: ServiceDetailPageProps) {
    const { slug } = await params;

    return (
        <PagePlaceholder
            title={`Servicio: ${slug}`}
            description="Dynamic public service detail placeholder prepared for future content, pricing, and checkout integration."
        />
    );
}