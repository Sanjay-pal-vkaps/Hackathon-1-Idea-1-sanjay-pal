import { ReservationDetailView } from "@/components/reservations/reservation-detail-view";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReservationDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ReservationDetailView reservationId={id} />;
}
