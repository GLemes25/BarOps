"use client";

import { createLabor, updateLabor } from "@/actions/labor-actions";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";

const laborSchema = z.object({
  role: z.string().min(1, "Função é obrigatória"),
  baseCost: z.coerce.number().positive("Deve ser positivo"),
  baseHours: z.coerce.number().int().positive("Deve ser positivo"),
  extraHourCost: z.coerce.number().min(0, "Deve ser zero ou positivo"),
});

type LaborFormValues = z.infer<typeof laborSchema>;

type LaborRecord = {
  id: number;
  role: string;
  baseCost: number;
  baseHours: number;
  extraHourCost: number;
};

type LaborFormProps = {
  record?: LaborRecord | null;
  onSuccess: () => void;
};

export const LaborForm = ({ record, onSuccess }: LaborFormProps) => {
  const form = useForm<LaborFormValues>({
    resolver: zodResolver(laborSchema) as Resolver<LaborFormValues>,
    defaultValues: {
      role: record?.role ?? "",
      baseCost: record?.baseCost ?? 0,
      baseHours: record?.baseHours ?? 1,
      extraHourCost: record?.extraHourCost ?? 0,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: LaborFormValues) => {
    try {
      if (record?.id) {
        await updateLabor(record.id, values);
      } else {
        await createLabor(values);
      }
      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
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
          name="baseCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custo base (R$)</FormLabel>
              <FormControl>
                <Input type="number" min={0} step={0.01} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="baseHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horas base</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="extraHourCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custo hora extra (R$)</FormLabel>
              <FormControl>
                <Input type="number" min={0} step={0.01} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Salvando..."
            : record
              ? "Salvar alterações"
              : "Adicionar mão de obra"}
        </Button>
      </form>
    </Form>
  );
};
