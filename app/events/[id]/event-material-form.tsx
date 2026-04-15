"use client";

import {
  addMaterialToEvent,
  updateEventMaterialQuantity,
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

type MaterialOption = { id: number; name: string };

const schema = z.object({
  materialCatalogId: z.number().optional(),
  quantity: z.coerce.number().int().positive("Quantidade deve ser positiva"),
});
type FormValues = z.infer<typeof schema>;

type Props = {
  eventId: number;
  availableMaterials?: MaterialOption[];
  record?: { id: number; quantity: number } | null;
  onSuccess: () => void;
};

export function EventMaterialForm({
  eventId,
  availableMaterials,
  record,
  onSuccess,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: { quantity: record?.quantity ?? 1 },
  });

  const onSubmit = async (values: FormValues) => {
    if (record) {
      await updateEventMaterialQuantity(record.id, values.quantity, eventId);
    } else {
      if (!values.materialCatalogId) {
        form.setError("materialCatalogId", {
          message: "Selecione um material",
        });
        return;
      }
      await addMaterialToEvent(
        eventId,
        values.materialCatalogId,
        values.quantity,
      );
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
            name="materialCatalogId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material</FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(Number(val))}
                  value={field.value ? String(field.value) : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um drink">
                        {field.value
                          ? availableMaterials?.find(
                              (material) => material.id === field.value,
                            )?.name
                          : "Selecione um material"}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableMaterials?.map((material) => (
                      <SelectItem key={material.id} value={String(material.id)}>
                        {material.name}
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
