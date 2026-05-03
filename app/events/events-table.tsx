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
import Link from "next/link";
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
    const result = await deleteEvent(id);
    if (!result.success) {
      console.error("Erro ao deletar:", result.error);
      alert("Não foi possível excluir o evento.");
    } else {
      router.refresh();
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <PageHeader
        title="Eventos"
        dialogTitle="Novo Evento"
        dialogContent={(onClose) => (
          <EventForm onSuccess={() => { onClose(); router.refresh(); }} />
        )}
      />

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="whitespace-nowrap">Data</TableHead>
              <TableHead className="whitespace-nowrap">Convidados</TableHead>
              <TableHead className="whitespace-nowrap">Duração</TableHead>
              <TableHead className="whitespace-nowrap">Drinks/pessoa</TableHead>
              <TableHead className="whitespace-nowrap">Total Drinks</TableHead>
              <TableHead className="w-16 whitespace-nowrap">Ações</TableHead>
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
                  <TableCell>
                    <Link
                      href={`/events/${event.id}`}
                      className="hover:underline font-medium"
                    >
                      {event.name}
                    </Link>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{dayjs(event.date).format("DD/MM/YYYY")}</TableCell>
                  <TableCell className="whitespace-nowrap">{event.guests}</TableCell>
                  <TableCell className="whitespace-nowrap">{event.durationHours}h</TableCell>
                  <TableCell className="whitespace-nowrap">{event.avgDrinksPerPerson}</TableCell>
                  <TableCell className="whitespace-nowrap">{event.totalDrinks}</TableCell>
                  <TableCell className="whitespace-nowrap">
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
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-[425px] md:max-w-2xl">
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
