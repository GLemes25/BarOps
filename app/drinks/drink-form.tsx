"use client";

import { createDrink, updateDrink } from "@/actions/drink-actions";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

export type IngredientOption = {
  id: number;
  name: string;
  unit: string;
};

const drinkSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  ingredients: z.array(
    z.object({
      ingredientId: z.number(),
      quantity: z.number().positive("Quantidade deve ser positiva"),
    }),
  ),
});

type DrinkFormValues = z.infer<typeof drinkSchema>;

type DrinkRecord = {
  id: number;
  name: string;
  ingredients: { id: number; name: string; quantity: number; unit: string }[];
};

type DrinkFormProps = {
  record?: DrinkRecord | null;
  onSuccess: () => void;
  availableIngredients: IngredientOption[];
};

export const DrinkForm = ({
  record,
  onSuccess,
  availableIngredients,
}: DrinkFormProps) => {
  const form = useForm<DrinkFormValues>({
    resolver: zodResolver(drinkSchema),
    defaultValues: {
      name: record?.name ?? "",
      ingredients:
        record?.ingredients.map((ing) => ({
          ingredientId: ing.id,
          quantity: ing.quantity,
        })) ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: DrinkFormValues) => {
    try {
      if (record?.id) {
        await updateDrink(record.id, values);
      } else {
        await createDrink(values);
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
              <FormLabel>Nome da bebida</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Gin Tônica" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2">
          <FormLabel>Receita</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <FormField
                control={form.control}
                name={`ingredients.${index}.ingredientId`}
                render={({ field: f }) => (
                  <FormItem className="flex-1">
                    <Select
                      onValueChange={(val) => f.onChange(Number(val))}
                      value={f.value ? String(f.value) : ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um ingrediente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableIngredients.map((ing) => (
                          <SelectItem key={ing.id} value={String(ing.id)}>
                            {ing.name} ({ing.unit})
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
                name={`ingredients.${index}.quantity`}
                render={({ field: f }) => (
                  <FormItem className="w-28">
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="Qtd"
                        {...f}
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
            onClick={() => append({ ingredientId: 0, quantity: 0 })}
          >
            Adicionar Ingrediente
          </Button>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Salvando..."
            : record
              ? "Salvar alterações"
              : "Criar bebida"}
        </Button>
      </form>
    </Form>
  );
};
