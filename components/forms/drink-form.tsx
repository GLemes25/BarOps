"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

const drinkSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
});

type DrinkFormValues = z.infer<typeof drinkSchema>;

type DrinkRecord = {
  id: number;
  name: string;
};

type DrinkFormProps = {
  record?: DrinkRecord | null;
  onSuccess: () => void;
};

export const DrinkForm = ({ record, onSuccess }: DrinkFormProps) => {
  const form = useForm<DrinkFormValues>({
    resolver: zodResolver(drinkSchema),
    defaultValues: {
      name: record?.name ?? "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (_values: DrinkFormValues) => {
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
              <FormLabel>Nome da bebida</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Gin Tônica" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : record ? "Salvar alterações" : "Criar bebida"}
        </Button>
      </form>
    </Form>
  );
};
