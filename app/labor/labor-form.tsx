"use client";

import { createLabor, updateLabor } from "@/actions/labor-actions";
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

const laborSchema = z.object({
  role: z.string().min(1, "Função é obrigatória"),
  quantity: z.coerce.number().int().positive("Deve ser positivo"),
  costPerPerson: z.coerce.number().positive("Deve ser positivo"),
});

type LaborFormValues = z.infer<typeof laborSchema>;

type LaborRecord = {
  id: number;
  role: string;
  quantity: number;
  costPerPerson: number;
};

type LaborFormProps = {
  eventId?: number;
  record?: LaborRecord | null;
  onSuccess: () => void;
};

export const LaborForm = ({ eventId, record, onSuccess }: LaborFormProps) => {
  const form = useForm<LaborFormValues>({
    resolver: zodResolver(laborSchema) as Resolver<LaborFormValues>,
    defaultValues: {
      role: record?.role ?? "",
      quantity: record?.quantity ?? 1,
      costPerPerson: record?.costPerPerson ?? 0,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: LaborFormValues) => {
    try {
      if (record?.id) {
        await updateLabor(record.id, values);
      } else if (eventId !== undefined) {
        await createLabor(eventId, values);
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
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Função</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Bartender" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="costPerPerson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custo por pessoa (R$)</FormLabel>
              <FormControl>
                <Input type="number" min={0} step={0.01} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : record ? "Salvar alterações" : "Adicionar mão de obra"}
        </Button>
      </form>
    </Form>
  );
};
