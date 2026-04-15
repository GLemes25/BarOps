"use server";

import { db } from "@/db";
import { ingredients } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./types";

type IngredientInput = {
  name: string;
  recipeUnit: string;
  purchaseUnit: string;
  purchaseCost: number;
  yieldQuantity: number;
};

export const getIngredients = async () => {
  const rows = await db.select().from(ingredients);
  return rows.map((row) => ({
    ...row,
    purchaseCost: Number(row.purchaseCost),
    yieldQuantity: Number(row.yieldQuantity),
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
      .values({
        ...values,
        purchaseCost: String(values.purchaseCost),
        yieldQuantity: String(values.yieldQuantity),
      })
      .returning({ id: ingredients.id });
    revalidatePath("/ingredients");
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
      .set({
        ...values,
        purchaseCost: String(values.purchaseCost),
        yieldQuantity: String(values.yieldQuantity),
      })
      .where(eq(ingredients.id, id));
    revalidatePath("/ingredients");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};
