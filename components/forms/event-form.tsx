"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
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

const eventSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
  guests: z.coerce.number().int().positive("Deve ser positivo"),
  durationHours: z.coerce.number().int().positive("Deve ser positivo"),
  avgDrinksPerPerson: z.coerce.number().positive("Deve ser positivo"),
});

type EventFormValues = z.infer<typeof eventSchema>;

type EventRecord = {
  id: number;
  name: string;
  date: string;
  guests: number;
  durationHours: number;
  avgDrinksPerPerson: number;
};

type EventFormProps = {
  record?: EventRecord | null;
  onSuccess: () => void;
};

export const EventForm = ({ record, onSuccess }: EventFormProps) => {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema) as Resolver<EventFormValues>,
    defaultValues: {
      name: record?.name ?? "",
      date: record?.date ?? "",
      guests: record?.guests ?? 1,
      durationHours: record?.durationHours ?? 1,
      avgDrinksPerPerson: record?.avgDrinksPerPerson ?? 1,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (_values: EventFormValues) => {
    onSuccess();
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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : record ? "Salvar alterações" : "Criar evento"}
        </Button>
      </form>
    </Form>
  );
};
