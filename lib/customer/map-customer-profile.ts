import type { Customer } from "@/lib/domain/types";

export type CustomerProfileRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  auth_user_id: string | null;
};

export function mapCustomerProfileRow(row: CustomerProfileRow): Customer {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
  };
}
