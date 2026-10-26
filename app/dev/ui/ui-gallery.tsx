"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

export function UiGallery() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8">
      <PageHeader
        title="UI component gallery"
        description="Basque Orchard Contemporary primitives for U1 review."
      />

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Form controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="demo-name">Guest name</Label>
              <Input id="demo-name" placeholder="Demo only" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="demo-shift">Service</Label>
              <Select id="demo-shift" className="mt-1" defaultValue="dinner">
                <option value="lunch">Lunch (demo)</option>
                <option value="dinner">Dinner (demo)</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="demo-notes">Notes</Label>
              <Textarea id="demo-notes" placeholder="Mock form field" className="mt-1" />
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Status badges</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant="table" tableStatus="available" />
          <Badge variant="table" tableStatus="reserved" />
          <Badge variant="table" tableStatus="occupied" />
          <Badge variant="table" tableStatus="cleaning" />
          <Badge variant="table" tableStatus="out_of_service" />
          <Badge variant="reservation" reservationStatus="pending" />
          <Badge variant="reservation" reservationStatus="confirmed" />
          <Badge variant="reservation" reservationStatus="no_show" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tabs, table, dialog, dropdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="one">
            <TabsList>
              <TabsTrigger value="one">Tab one</TabsTrigger>
              <TabsTrigger value="two">Tab two</TabsTrigger>
            </TabsList>
            <TabsContent value="one">
              <Alert variant="info">Tab panel content (demo)</Alert>
            </TabsContent>
            <TabsContent value="two">
              <Alert variant="warning">Second tab (demo)</Alert>
            </TabsContent>
          </Tabs>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>3</TableCell>
                <TableCell>
                  <Badge variant="table" tableStatus="reserved" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="flex flex-wrap gap-2">
            <DialogTrigger onClick={() => setDialogOpen(true)}>
              Open dialog
            </DialogTrigger>
            <DropdownMenu
              trigger={<Button variant="outline">Dropdown</Button>}
            >
              <DropdownMenuItem>Mock action A</DropdownMenuItem>
              <DropdownMenuItem>Mock action B</DropdownMenuItem>
            </DropdownMenu>
          </div>
          <Dialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            title="Demo dialog"
            description="Mock confirmation — nothing is saved."
          />
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        <EmptyState
          title="No reservations"
          description="Empty state pattern for list screens (demo)."
        />
        <div className="space-y-2">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-24 w-full" />
          <Alert variant="error">Error alert pattern (demo)</Alert>
        </div>
      </section>
    </div>
  );
}
