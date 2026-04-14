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

const materialSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  quantity: z.coerce.number().int().positive("Deve ser positivo"),
  costPerUnit: z.coerce.number().positive("Deve ser positivo"),
});

type MaterialFormValues = z.infer<typeof materialSchema>;

type MaterialRecord = {
  id: number;
  name: string;
  quantity: number;
  costPerUnit: number;
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
      quantity: record?.quantity ?? 1,
      costPerUnit: record?.costPerUnit ?? 0,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (_values: MaterialFormValues) => {
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
              <FormLabel>Nome do material</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Copo long drink" {...field} />
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
          name="costPerUnit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custo por unidade (R$)</FormLabel>
              <FormControl>
                <Input type="number" min={0} step={0.01} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : record ? "Salvar alterações" : "Adicionar material"}
        </Button>
      </form>
    </Form>
  );
};
