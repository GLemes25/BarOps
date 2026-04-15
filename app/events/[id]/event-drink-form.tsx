"use client";

import { addDrinkToEvent } from "@/actions/event-actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

type DrinkOption = { id: number; name: string };

const schema = z.object({
  drinkId: z.number(),
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
  });

  const onSubmit = async (values: FormValues) => {
    await addDrinkToEvent(eventId, values.drinkId);
    onSuccess();
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
                onValueChange={(val) => field.onChange(Number(val))}
                value={field.value ? String(field.value) : ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um drink">
                      {field.value
                        ? availableDrinks.find(
                            (drink) => drink.id === field.value,
                          )?.name
                        : "Selecione um drink"}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableDrinks.map((drink) => (
                    <SelectItem key={drink.id} value={String(drink.id)}>
                      {drink.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Adicionando..." : "Adicionar"}
        </Button>
      </form>
    </Form>
  );
}
