import type { CustomerRepository } from "@/lib/domain/repositories/types";
import { DEMO_CUSTOMERS } from "@/lib/mock/fixtures/customers";

export class MockCustomerRepository implements CustomerRepository {
  async list() {
    return [...DEMO_CUSTOMERS];
  }

  async get(id: string) {
    return DEMO_CUSTOMERS.find((c) => c.id === id) ?? null;
  }
}
