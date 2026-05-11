"use client";

import { addDrinkToEvent, addDrinksToEvent } from "@/actions/event-actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type DrinkVariant = { id: number; name: string };

type DrinkOption = {
  id: number;
  name: string;
  variants: DrinkVariant[];
};

const schema = z.object({
  drinkId: z.number(),
  variantIds: z.array(z.number()),
});
type FormValues = z.infer<typeof schema>;

type Props = {
  eventId: number;
  availableDrinks: DrinkOption[];
  onSuccess: () => void;
};

export function EventDrinkForm({ eventId, availableDrinks, onSuccess }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { drinkId: 0, variantIds: [] },
  });

  const selectedDrinkId = form.watch("drinkId");
  const selectedDrink = availableDrinks.find((d) => d.id === selectedDrinkId);
  const hasVariants = (selectedDrink?.variants.length ?? 0) > 0;

  const onSubmit = async (values: FormValues) => {
    if (hasVariants) {
      if (values.variantIds.length === 0) return;
      await addDrinksToEvent(eventId, values.variantIds);
    } else {
      await addDrinkToEvent(eventId, values.drinkId);
    }
    onSuccess();
  };

  const handleVariantToggle = (variantId: number, checked: boolean) => {
    const current = form.getValues("variantIds");
    form.setValue(
      "variantIds",
      checked ? [...current, variantId] : current.filter((id) => id !== variantId),
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="drinkId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Drink</FormLabel>
              <Select
                onValueChange={(val) => {
                  field.onChange(Number(val));
                  form.setValue("variantIds", []);
                }}
                value={field.value ? String(field.value) : ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um drink">
                      {field.value
                        ? availableDrinks.find((d) => d.id === field.value)?.name
                        : "Selecione um drink"}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableDrinks.map((drink) => (
                    <SelectItem key={drink.id} value={String(drink.id)}>
                      {drink.name}
                      {drink.variants.length > 0 && (
                        <span className="ml-1 text-muted-foreground text-xs">
                          ({drink.variants.length} variações)
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {hasVariants && selectedDrink && (
          <div className="flex flex-col gap-2">
            <Label>Selecione as variações</Label>
            <div className="flex flex-col gap-2 rounded-md border p-3">
              {selectedDrink.variants.map((variant) => (
                <div key={variant.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`variant-${variant.id}`}
                    onCheckedChange={(checked) =>
                      handleVariantToggle(variant.id, checked === true)
                    }
                    checked={form.watch("variantIds").includes(variant.id)}
                  />
                  <label
                    htmlFor={`variant-${variant.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {variant.name}
                  </label>
                </div>
              ))}
            </div>
            {form.watch("variantIds").length === 0 && (
              <p className="text-xs text-muted-foreground">
                Selecione ao menos uma variação.
              </p>
            )}
          </div>
        )}

        <Button
          type="submit"
          disabled={
            form.formState.isSubmitting ||
            !selectedDrinkId ||
            (hasVariants && form.watch("variantIds").length === 0)
          }
        >
          {form.formState.isSubmitting ? "Adicionando..." : "Adicionar"}
        </Button>
      </form>
    </Form>
  );
}
