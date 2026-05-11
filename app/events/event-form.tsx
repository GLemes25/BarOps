"use client";

import { createEvent, updateEvent } from "@/actions/event-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const eventSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
  guests: z.coerce.number().int().positive("Deve ser positivo"),
  durationHours: z.coerce.number().int().positive("Deve ser positivo"),
  avgDrinksPerPerson: z.coerce.number().positive("Deve ser positivo"),
  status: z.enum(["planning", "confirmed", "completed", "canceled"]),
  revenue: z.coerce.number().min(0),
});

type EventFormValues = z.infer<typeof eventSchema>;

type EventRecord = {
  id: number;
  name: string;
  date: string;
  guests: number;
  durationHours: number;
  avgDrinksPerPerson: number;
  status: "planning" | "confirmed" | "completed" | "canceled";
  revenue: number;
};

type EventFormProps = {
  record?: EventRecord | null;
  onSuccess: () => void;
};

const statusOptions = [
  { value: "planning", label: "Planejamento" },
  { value: "confirmed", label: "Confirmado" },
  { value: "completed", label: "Concluído" },
  { value: "canceled", label: "Cancelado" },
] as const;

export const EventForm = ({ record, onSuccess }: EventFormProps) => {
  const [revenueType, setRevenueType] = useState<"total" | "per_person">("total");

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema) as Resolver<EventFormValues>,
    defaultValues: {
      name: record?.name ?? "",
      date: record?.date ?? "",
      guests: record?.guests ?? 1,
      durationHours: record?.durationHours ?? 1,
      avgDrinksPerPerson: record?.avgDrinksPerPerson ?? 1,
      status: record?.status ?? "planning",
      revenue: record?.revenue ?? 0,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: EventFormValues) => {
    try {
      const finalRevenue =
        revenueType === "per_person" ? values.revenue * values.guests : values.revenue;

      const payload = { ...values, revenue: finalRevenue };

      if (record?.id) {
        await updateEvent(record.id, payload);
      } else {
        await createEvent(payload);
      }
      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do evento</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Casamento Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="guests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Convidados</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="durationHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duração (horas)</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avgDrinksPerPerson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Média de drinks por pessoa</FormLabel>
              <FormControl>
                <Input type="number" min={0.1} step={0.1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status">
                      {statusOptions.find((o) => o.value === field.value)?.label ?? "Selecione o status"}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="revenue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Receita</FormLabel>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={revenueType === "total" ? "default" : "outline"}
                  onClick={() => setRevenueType("total")}
                >
                  Total
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={revenueType === "per_person" ? "default" : "outline"}
                  onClick={() => setRevenueType("per_person")}
                >
                  Por pessoa
                </Button>
              </div>
              <FormControl>
                <Input type="number" min={0} step={0.01} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : record ? "Salvar alterações" : "Criar evento"}
        </Button>
      </form>
    </Form>
  );
};
