"use client";

import { useEffect, useState } from "react";
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
import type { StaffRole } from "@/lib/domain/types";
import { staffRoleLabel } from "@/lib/staff/labels";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type StaffRow = {
  displayName: string;
  email: string;
  role: StaffRole;
};

export function StaffUsersView() {
  const [rows, setRows] = useState<StaffRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = getSupabaseBrowserClient();
      const { data, error: qError } = await supabase
        .from("staff_profiles")
        .select("display_name, email, role")
        .order("display_name");

      if (cancelled) return;
      if (qError) {
        setError(qError.message);
        return;
      }

      setRows(
        (data ?? []).map((row) => ({
          displayName: row.display_name as string,
          email: row.email as string,
          role: row.role as StaffRole,
        })),
      );
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & roles"
        description="Staff accounts from Supabase Auth · create users with npm run staff:create"
      />
      {error ? <Alert variant="warning">{error}</Alert> : null}
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
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-sm text-charcoal/60">
                  No staff profiles yet. Run staff:create to add the first owner.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.email}>
                  <TableCell className="font-medium">{row.displayName}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{staffRoleLabel(row.role)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
