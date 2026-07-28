"use client";

import { deleteEvent, duplicateEvent } from "@/actions/event-actions";
import { EventForm } from "@/app/events/event-form";
import { PageHeader } from "@/components/page-header";
import { TableRowActions } from "@/components/table-row-actions";
import { Badge } from "@/components/ui/badge";
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
  time?: string | null;
  guests: number;
  durationHours: number;
  avgDrinksPerPerson: number;
  totalDrinks: number;
  status: "planning" | "confirmed" | "completed" | "canceled";
  revenue: number;
};

const statusConfig: Record<
  EventRecord["status"],
  { label: string; className: string }
> = {
  planning: {
    label: "Planejamento",
    className: "bg-event-planning text-event-planning-fg",
  },
  confirmed: {
    label: "Confirmado",
    className: "bg-event-confirmed text-event-confirmed-fg",
  },
  completed: {
    label: "Concluído",
    className: "bg-event-completed text-event-completed-fg",
  },
  canceled: {
    label: "Cancelado",
    className: "bg-event-canceled text-event-canceled-fg",
  },
};

type Props = {
  initialData: EventRecord[];
};

export function EventsTable({ initialData }: Props) {
  const router = useRouter();
  const [events, setEvents] = useState<EventRecord[]>(initialData);
  useEffect(() => {
    setEvents(initialData);
  }, [initialData]);
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

  const handleDuplicate = async (event: EventRecord) => {
    const result = await duplicateEvent(event.id);
    if (!result.success || !result.data) {
      alert("Não foi possível duplicar o evento.");
    } else {
      router.refresh();
      setSelectedEvent({
        ...event,
        id: result.data.newEventId,
        name: `${event.name} copy`,
        status: "planning",
        revenue: 0,
      });
      setIsEditOpen(true);
    }
  };

  useEffect(() => {
    const editId = new URLSearchParams(window.location.search).get("edit");
    if (!editId) return;
    const found = initialData.find((e) => e.id === Number(editId));
    if (found) {
      setSelectedEvent(found);
      setIsEditOpen(true);
    }
  }, [initialData]);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <PageHeader
        title="Eventos"
        dialogTitle="Novo Evento"
        dialogContent={(onClose) => (
          <EventForm
            onSuccess={() => {
              onClose();
              router.refresh();
            }}
          />
        )}
      />

      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="hidden sm:table-cell w-28">Data</TableHead>
            <TableHead className="hidden md:table-cell w-24">
              Convidados
            </TableHead>
            <TableHead className="hidden lg:table-cell w-24">Duração</TableHead>
            <TableHead className="hidden lg:table-cell w-28">
              Drinks/pessoa
            </TableHead>
            <TableHead className="hidden lg:table-cell w-28">
              Total Drinks
            </TableHead>
            <TableHead className="w-32">Status</TableHead>
            <TableHead className="w-16 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center text-muted-foreground"
              >
                Nenhum evento cadastrado.
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="truncate">
                  <Link
                    href={`/events/${event.id}`}
                    className="hover:underline font-medium truncate block"
                  >
                    {event.name}
                  </Link>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {dayjs(event.date).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {event.guests}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {event.durationHours}h
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {event.avgDrinksPerPerson}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {event.totalDrinks}
                </TableCell>
                <TableCell>
                  <Badge className={statusConfig[event.status].className}>
                    {statusConfig[event.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <TableRowActions
                    onEdit={() => handleEdit(event)}
                    onDelete={() => handleDelete(event.id)}
                    onDuplicate={() => handleDuplicate(event)}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-106.25 md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Evento</DialogTitle>
          </DialogHeader>
          <EventForm
            record={selectedEvent}
            onSuccess={() => {
              setIsEditOpen(false);
              router.refresh();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
