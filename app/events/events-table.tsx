"use client";

import { deleteEvent } from "@/actions/event-actions";
import { EventForm } from "@/app/events/event-form";
import { PageHeader } from "@/components/page-header";
import { TableRowActions } from "@/components/table-row-actions";
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
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type EventRecord = {
  id: number;
  name: string;
  date: string;
  guests: number;
  durationHours: number;
  avgDrinksPerPerson: number;
  totalDrinks: number;
};

type Props = {
  initialData: EventRecord[];
};

export function EventsTable({ initialData }: Props) {
  const router = useRouter();
  const [events, setEvents] = useState<EventRecord[]>(initialData);
  useEffect(() => { setEvents(initialData); }, [initialData]);
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = (event: EventRecord) => {
    setSelectedEvent(event);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteEvent(id);
    router.refresh();
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Eventos"
        dialogTitle="Novo Evento"
        dialogContent={(onClose) => (
          <EventForm onSuccess={() => { onClose(); router.refresh(); }} />
        )}
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
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground"
              >
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
          <EventForm
            record={selectedEvent}
            onSuccess={() => { setIsEditOpen(false); router.refresh(); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
