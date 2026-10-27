import { CustomerLoginForm } from "@/components/booking/customer-login-form";

export const metadata = {
  title: "Guest Sign In · Iturrieta Sagardotegia",
  description: "Sign in to your Iturrieta customer account to manage table reservations.",
};

export default function BookLoginPage() {
  return (
    <div className="py-4">
      <CustomerLoginForm />
    </div>
  );
}
