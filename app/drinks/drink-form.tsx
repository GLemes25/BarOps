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
import { useFieldArray, useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export type IngredientOption = {
  id: number;
  name: string;
  recipeUnit: string;
};

export type ParentDrinkOption = {
  id: number;
  name: string;
};

const drinkSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  parentId: z
    .union([z.coerce.number(), z.string()])
    .transform((val) =>
      val === "" || val === "0" || val === 0 || val === null || val === undefined
        ? null
        : Number(val),
    )
    .nullable()
    .optional(),
  ingredients: z.array(
    z.object({
      ingredientId: z.coerce.number(),
      quantity: z.coerce.number().positive("Quantidade deve ser positiva"),
    }),
  ),
});

type DrinkFormValues = z.infer<typeof drinkSchema>;

type DrinkRecord = {
  id: number;
  name: string;
  parentId: number | null;
  ingredients: {
    id: number;
    name: string;
    quantity: number;
    recipeUnit: string;
  }[];
};

type DrinkFormProps = {
  record?: DrinkRecord | null;
  onSuccess: () => void;
  availableIngredients: IngredientOption[];
  availableParentDrinks: ParentDrinkOption[];
};

export const DrinkForm = ({
  record,
  onSuccess,
  availableIngredients,
  availableParentDrinks,
}: DrinkFormProps) => {
  const form = useForm<DrinkFormValues>({
    resolver: zodResolver(drinkSchema) as Resolver<DrinkFormValues>,
    defaultValues: {
      name: record?.name ?? "",
      parentId: record?.parentId ?? null,
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
    const result = record?.id
      ? await updateDrink(record.id, values)
      : await createDrink(values);

    if (!result.success) {
      toast.error(result.error ?? "Erro ao salvar bebida");
      return;
    }

    onSuccess();
  };

  const parentOptions = availableParentDrinks.filter((d) => d.id !== record?.id);

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

        {parentOptions.length > 0 && (
          <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>É variação de outro drink? (Drink Pai)</FormLabel>
                <Select
                  onValueChange={(val) =>
                    field.onChange(val === "0" ? null : Number(val))
                  }
                  value={field.value ? String(field.value) : "0"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Drink independente">
                        {field.value
                          ? parentOptions.find((d) => d.id === field.value)?.name
                          : "Drink independente"}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">Drink independente</SelectItem>
                    {parentOptions.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex flex-col gap-2">
          <FormLabel>Receita</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col sm:flex-row gap-2 items-start">
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
                        {availableIngredients.map((ing) => (
                          <SelectItem key={ing.id} value={String(ing.id)}>
                            {ing.name} ({ing.recipeUnit})
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
