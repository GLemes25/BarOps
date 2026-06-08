"use client";

import { EventForm } from "@/app/events/event-form";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
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
  status: "planning" | "confirmed" | "completed" | "canceled";
  revenue: number;
};

type Props = {
  record: EventRecord;
};

export const EditEventButton = ({ record }: Props) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "print:hidden"
        )}
      >
        <Pencil className="mr-2 h-4 w-4" />
        Editar Evento
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Evento</DialogTitle>
        </DialogHeader>
        <EventForm
          record={record}
          onSuccess={() => {
            setIsOpen(false);
            router.refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
