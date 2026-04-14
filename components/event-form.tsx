"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createEvent } from "@/actions/create-event";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  guests: z.coerce.number().int().positive("Número de convidados deve ser positivo"),
  durationHours: z.coerce.number().int().positive("Duração deve ser positiva"),
  avgDrinksPerPerson: z.coerce
    .number()
    .positive("Média de drinks deve ser positiva")
    .transform((val) => String(val)),
});

type EventFormValues = z.input<typeof eventSchema>;

export const EventForm = () => {
  const router = useRouter();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      date: "",
      guests: 0,
      durationHours: 0,
      avgDrinksPerPerson: 0,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: EventFormValues) => {
    const parsed = eventSchema.parse(values);
    const totalDrinks = Math.round(
      Number(parsed.guests) * Number(parsed.avgDrinksPerPerson),
    );

    const result = await createEvent({
      name: parsed.name,
      date: new Date(parsed.date),
      guests: parsed.guests,
      durationHours: parsed.durationHours,
      avgDrinksPerPerson: parsed.avgDrinksPerPerson,
      totalDrinks,
    });

    if (!result.success) {
      form.setError("root", { message: result.error });
      return;
    }

    router.push(`/events/${result.data?.id}`);
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Novo Evento</CardTitle>
      </CardHeader>
      <CardContent>
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
                    <Input type="number" min={1} {...field} value={field.value as number} />
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
                    <Input type="number" min={1} {...field} value={field.value as number} />
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
                    <Input type="number" min={0.1} step={0.1} {...field} value={field.value as number} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <p className="text-destructive text-sm font-medium">
                {form.formState.errors.root.message}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Criar evento"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
