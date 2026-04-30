"use client";

import type { IngredientRecord } from "@/actions/ingredient-actions";
import {
  createIngredient,
  updateIngredient,
} from "@/actions/ingredient-actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useFieldArray, useForm, type Resolver } from "react-hook-form";
import { z } from "zod";

const ingredientSchema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório"),
    recipeUnit: z.string().min(1, "Unidade de receita é obrigatória"),
    isSubRecipe: z.boolean(),
    purchaseUnit: z.string().optional().or(z.literal("")),
    purchaseCost: z.coerce.number().min(0).optional(),
    yieldQuantity: z.coerce.number().positive("Deve ser positivo"),
    components: z.array(
      z.object({
        childId: z.number(),
        quantity: z.number().positive("Quantidade deve ser positiva"),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    if (!data.isSubRecipe) {
      if (!data.purchaseUnit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Unidade de compra é obrigatória",
          path: ["purchaseUnit"],
        });
      }
      if (data.purchaseCost === undefined || data.purchaseCost <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Deve ser positivo",
          path: ["purchaseCost"],
        });
      }
    }
  });

type IngredientFormValues = z.infer<typeof ingredientSchema>;

type IngredientFormProps = {
  record?: IngredientRecord | null;
  availableIngredients: IngredientRecord[];
  onSuccess: () => void;
};

export const IngredientForm = ({
  record,
  availableIngredients,
  onSuccess,
}: IngredientFormProps) => {
  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(ingredientSchema) as Resolver<IngredientFormValues>,
    defaultValues: {
      name: record?.name ?? "",
      recipeUnit: record?.recipeUnit ?? "",
      isSubRecipe: record?.isSubRecipe ?? false,
      purchaseUnit: record?.purchaseUnit ?? "",
      purchaseCost: record?.purchaseCost ?? 0,
      yieldQuantity: record?.yieldQuantity ?? 0,
      components: record?.components ?? [],
    },
  });

  const isSubRecipe = form.watch("isSubRecipe");

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "components",
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: IngredientFormValues) => {
    const payload = {
      ...values,
      purchaseUnit: values.isSubRecipe ? undefined : values.purchaseUnit,
      purchaseCost: values.isSubRecipe ? undefined : values.purchaseCost,
    };

    try {
      const result = record?.id
        ? await updateIngredient(record.id, payload)
        : await createIngredient(payload);

      if (!result.success) {
        console.error("Falha ao salvar ingrediente:", result.error);
        return;
      }

      onSuccess();
    } catch (error) {
      console.error("Erro inesperado ao salvar ingrediente:", error);
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
                <Input placeholder="Ex: Espuma de Gengibre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isSubRecipe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0 mt-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">
                Este ingrediente é um Pre-batch?
              </FormLabel>
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

        {!isSubRecipe && (
          <>
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
          </>
        )}

        <FormField
          control={form.control}
          name="yieldQuantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {isSubRecipe
                  ? "Rendimento da Receita (em Un. Receita)"
                  : "Fator de rendimento"}
              </FormLabel>
              <FormControl>
                <Input type="number" min={0} step={0.0001} {...field} />
              </FormControl>
              {!isSubRecipe && (
                <FormDescription>
                  Ex: Quantos ml rende 1 Kg ou 1 Garrafa
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {isSubRecipe && (
          <div className="flex flex-col gap-2">
            <FormLabel>Ingredientes da Sub-receita</FormLabel>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <FormField
                  control={form.control}
                  name={`components.${index}.childId`}
                  render={({ field: f }) => (
                    <FormItem className="flex-1">
                      <Select
                        onValueChange={(val) => f.onChange(Number(val))}
                        value={f.value ? String(f.value) : ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um ingrediente">
                              {f.value
                                ? availableIngredients.find(
                                    (ing) => ing.id === f.value,
                                  )?.name
                                : "Selecione um ingrediente"}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableIngredients
                            .filter(
                              (ingredients) => ingredients.id !== record?.id,
                            )
                            .map((ingredients) => (
                              <SelectItem
                                key={ingredients.id}
                                value={String(ingredients.id)}
                              >
                                {ingredients.name} ({ingredients.recipeUnit})
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
                  name={`components.${index}.quantity`}
                  render={({ field: f }) => (
                    <FormItem className="w-28">
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="Qtd"
                          {...f}
                          onChange={(e) => f.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ childId: 0, quantity: 0 })}
            >
              Adicionar Ingrediente
            </Button>
          </div>
        )}

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
