import { SelfServiceLinkView } from "@/components/booking/self-service-link-view";

type PageProps = {
  params: Promise<{ token: string }>;
};

export default async function SelfServiceLinkPage({ params }: PageProps) {
  const { token } = await params;
  return <SelfServiceLinkView token={token} />;
}
