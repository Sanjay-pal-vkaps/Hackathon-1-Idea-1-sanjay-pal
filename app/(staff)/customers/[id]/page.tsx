import { CustomerDetailView } from "@/components/customers/customer-detail-view";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <CustomerDetailView customerId={id} />;
}
