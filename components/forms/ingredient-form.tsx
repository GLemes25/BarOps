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

const ingredientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  unit: z.string().min(1, "Unidade é obrigatória"),
  costPerUnit: z.coerce.number().positive("Deve ser positivo"),
});

type IngredientFormValues = z.infer<typeof ingredientSchema>;

type IngredientRecord = {
  id: number;
  name: string;
  unit: string;
  costPerUnit: number;
};

type IngredientFormProps = {
  record?: IngredientRecord | null;
  onSuccess: () => void;
};

export const IngredientForm = ({ record, onSuccess }: IngredientFormProps) => {
  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(ingredientSchema) as Resolver<IngredientFormValues>,
    defaultValues: {
      name: record?.name ?? "",
      unit: record?.unit ?? "",
      costPerUnit: record?.costPerUnit ?? 0,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (_values: IngredientFormValues) => {
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
              <FormLabel>Nome do ingrediente</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Suco de limão" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unidade</FormLabel>
              <FormControl>
                <Input placeholder="Ex: ml" {...field} />
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
                <Input type="number" min={0} step={0.0001} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : record ? "Salvar alterações" : "Criar ingrediente"}
        </Button>
      </form>
    </Form>
  );
};
