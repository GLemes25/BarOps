"use client";

import {
  createIngredient,
  updateIngredient,
} from "@/actions/ingredient-actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";

const ingredientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  recipeUnit: z.string().min(1, "Unidade de receita é obrigatória"),
  purchaseUnit: z.string().min(1, "Unidade de compra é obrigatória"),
  purchaseCost: z.coerce.number().positive("Deve ser positivo"),
  yieldQuantity: z.coerce.number().positive("Deve ser positivo"),
});

type IngredientFormValues = z.infer<typeof ingredientSchema>;

type IngredientRecord = {
  id: number;
  name: string;
  recipeUnit: string;
  purchaseUnit: string;
  purchaseCost: number;
  yieldQuantity: number;
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
      recipeUnit: record?.recipeUnit ?? "",
      purchaseUnit: record?.purchaseUnit ?? "",
      purchaseCost: record?.purchaseCost ?? 0,
      yieldQuantity: record?.yieldQuantity ?? 0,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: IngredientFormValues) => {
    try {
      if (record?.id) {
        await updateIngredient(record.id, values);
      } else {
        await createIngredient(values);
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
          name="recipeUnit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unidade de receita</FormLabel>
              <FormControl>
                <Input placeholder="Ex: ml, un" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="purchaseUnit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unidade de compra</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Kg, Garrafa 1L" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="purchaseCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custo de compra (R$)</FormLabel>
              <FormControl>
                <Input type="number" min={0} step={0.01} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="yieldQuantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fator de rendimento</FormLabel>
              <FormControl>
                <Input type="number" min={0} step={0.0001} {...field} />
              </FormControl>
              <FormDescription>
                Ex: Quantos ml rende 1 Kg ou 1 Garrafa
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Salvando..."
            : record
              ? "Salvar alterações"
              : "Criar ingrediente"}
        </Button>
      </form>
    </Form>
  );
};
