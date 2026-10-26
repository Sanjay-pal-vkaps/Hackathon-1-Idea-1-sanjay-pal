"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Customer, Reservation } from "@/lib/domain/types";
import { getMockRepositories } from "@/lib/mock/repositories";

export function CustomersListView() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    void (async () => {
      const repos = getMockRepositories();
      const [guests, rows] = await Promise.all([
        repos.customers.list(),
        repos.reservations.list(),
      ]);
      setCustomers(guests);
      setReservations(rows);
    })();
  }, []);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of reservations) {
      map.set(r.customerId, (map.get(r.customerId) ?? 0) + 1);
    }
    return map;
  }, [reservations]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q),
    );
  }, [customers, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Guest directory and booking history · mock data"
      />

      <Input
        placeholder="Search name, email, phone…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <div className="hidden rounded-xl border border-border-muted bg-white md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Reservations</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.fullName}</TableCell>
                <TableCell>
                  <p>{c.email}</p>
                  <p className="text-xs text-charcoal/55">{c.phone}</p>
                </TableCell>
                <TableCell>{counts.get(c.id) ?? 0}</TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/customers/${c.id}`}
                    className="text-sm font-medium text-apple-copper hover:underline"
                  >
                    Profile
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="space-y-3 md:hidden">
        {filtered.map((c) => (
          <li
            key={c.id}
            className="rounded-xl border border-border-muted bg-white p-4"
            onClick={() => router.push(`/customers/${c.id}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter") router.push(`/customers/${c.id}`);
            }}
            role="button"
            tabIndex={0}
          >
            <p className="font-semibold">{c.fullName}</p>
            <p className="text-sm text-charcoal/65">{c.phone}</p>
            <p className="mt-1 text-xs text-charcoal/55">
              {counts.get(c.id) ?? 0} reservations
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
