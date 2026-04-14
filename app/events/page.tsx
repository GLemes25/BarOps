"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { PageHeader } from "@/components/page-header";
import { TableRowActions } from "@/components/table-row-actions";
import { EventForm } from "@/components/forms/event-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type EventRecord = {
  id: number;
  name: string;
  date: string;
  guests: number;
  durationHours: number;
  avgDrinksPerPerson: number;
  totalDrinks: number;
};

const INITIAL_EVENTS: EventRecord[] = [];

export default function EventsPage() {
  const [events, setEvents] = useState<EventRecord[]>(INITIAL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = (event: EventRecord) => {
    setSelectedEvent(event);
    setIsEditOpen(true);
  };

  const handleDelete = (_id: number) => {
    setEvents((prev) => prev.filter((e) => e.id !== _id));
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Eventos"
        dialogTitle="Novo Evento"
        dialogContent={(onClose) => <EventForm onSuccess={onClose} />}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Convidados</TableHead>
            <TableHead>Duração</TableHead>
            <TableHead>Drinks/pessoa</TableHead>
            <TableHead>Total Drinks</TableHead>
            <TableHead className="w-16">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                Nenhum evento cadastrado.
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.name}</TableCell>
                <TableCell>{dayjs(event.date).format("DD/MM/YYYY")}</TableCell>
                <TableCell>{event.guests}</TableCell>
                <TableCell>{event.durationHours}h</TableCell>
                <TableCell>{event.avgDrinksPerPerson}</TableCell>
                <TableCell>{event.totalDrinks}</TableCell>
                <TableCell>
                  <TableRowActions
                    onEdit={() => handleEdit(event)}
                    onDelete={() => handleDelete(event.id)}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Evento</DialogTitle>
          </DialogHeader>
          <EventForm record={selectedEvent} onSuccess={() => setIsEditOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
