"use client";

import { PageHeader } from "@/components/ui/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert } from "@/components/ui/alert";

const DEMO_STAFF = [
  { name: "Iturrieta Owner", email: "owner@iturrieta.demo", role: "Owner" },
  { name: "Front Desk", email: "manager@iturrieta.demo", role: "Manager" },
  { name: "Floor Team", email: "waiter@iturrieta.demo", role: "Waiter" },
];

export function StaffUsersStub() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & roles"
        description="Owner placeholder · full role UI arrives in U6"
      />
      <Alert variant="info">
        Sample accounts for mock login only. Use the role switcher in the sidebar or top bar to
        test U6 permissions instantly.
      </Alert>
      <div className="rounded-xl border border-border-muted bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DEMO_STAFF.map((row) => (
              <TableRow key={row.email}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
