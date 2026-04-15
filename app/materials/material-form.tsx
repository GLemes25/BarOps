"use client";

import { createMaterial, updateMaterial } from "@/actions/material-actions";
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

const materialSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  defaultCost: z.coerce.number().positive("Deve ser positivo"),
});

type MaterialFormValues = z.infer<typeof materialSchema>;

type MaterialRecord = {
  id: number;
  name: string;
  defaultCost: number;
};

type MaterialFormProps = {
  record?: MaterialRecord | null;
  onSuccess: () => void;
};

export const MaterialForm = ({ record, onSuccess }: MaterialFormProps) => {
  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(materialSchema) as Resolver<MaterialFormValues>,
    defaultValues: {
      name: record?.name ?? "",
      defaultCost: record?.defaultCost ?? 0,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: MaterialFormValues) => {
    try {
      if (record?.id) {
        await updateMaterial(record.id, values);
      } else {
        await createMaterial(values);
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do material</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Balcão" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="defaultCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor unitário (R$)</FormLabel>
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
              : "Adicionar material"}
        </Button>
      </form>
    </Form>
  );
};
