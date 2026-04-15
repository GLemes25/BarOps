"use client";

import {
  addLaborToEvent,
  updateEventLaborQuantity,
} from "@/actions/event-actions";
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
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";

type LaborOption = { id: number; role: string };

const schema = z.object({
  laborCatalogId: z.number().optional(),
  quantity: z.coerce.number().int().positive("Quantidade deve ser positiva"),
});
type FormValues = z.infer<typeof schema>;

type Props = {
  eventId: number;
  availableLabor?: LaborOption[];
  record?: { id: number; quantity: number } | null;
  onSuccess: () => void;
};

export function EventLaborForm({
  eventId,
  availableLabor,
  record,
  onSuccess,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: { quantity: record?.quantity ?? 1 },
  });

  const onSubmit = async (values: FormValues) => {
    if (record) {
      await updateEventLaborQuantity(record.id, values.quantity, eventId);
    } else {
      if (!values.laborCatalogId) {
        form.setError("laborCatalogId", { message: "Selecione uma função" });
        return;
      }
      await addLaborToEvent(eventId, values.laborCatalogId, values.quantity);
    }
    onSuccess();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {!record && (
          <FormField
            control={form.control}
            name="laborCatalogId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Função</FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(Number(val))}
                  value={field.value ? String(field.value) : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um drink">
                        {field.value
                          ? availableLabor?.find(
                              (labor) => labor.id === field.value,
                            )?.role
                          : "Selecione uma Função"}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableLabor?.map((labor) => (
                      <SelectItem key={labor.id} value={String(labor.id)}>
                        {labor.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
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
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? "Salvando..."
            : record
              ? "Salvar alterações"
              : "Adicionar"}
        </Button>
      </form>
    </Form>
  );
}
