"use server";

import { db } from "@/db";
import { ingredients } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./types";

type IngredientInput = {
  name: string;
  unit: string;
  costPerUnit: number;
};

export const getIngredients = async () => {
  const rows = await db.select().from(ingredients);
  return rows.map((row) => ({
    ...row,
    costPerUnit: Number(row.costPerUnit),
  }));
};

export const deleteIngredient = async (id: number): Promise<ActionResult> => {
  try {
    await db.delete(ingredients).where(eq(ingredients.id, id));
    revalidatePath("/ingredients");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const createIngredient = async (
  values: IngredientInput,
): Promise<ActionResult<{ id: number }>> => {
  try {
    const [ingredient] = await db
      .insert(ingredients)
      .values({ ...values, costPerUnit: String(values.costPerUnit) })
      .returning({ id: ingredients.id });
    return { success: true, data: { id: ingredient.id } };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const updateIngredient = async (
  id: number,
  values: IngredientInput,
): Promise<ActionResult> => {
  try {
    await db
      .update(ingredients)
      .set({ ...values, costPerUnit: String(values.costPerUnit) })
      .where(eq(ingredients.id, id));
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};
