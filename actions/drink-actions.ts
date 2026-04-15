"use server";

import { db } from "@/db";
import { drinks, drinkIngredients, ingredients } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./types";

type IngredientEntry = {
  ingredientId: number;
  quantity: number;
};

type DrinkInput = {
  name: string;
  ingredients: IngredientEntry[];
};

export const getDrinks = async () => {
  const rows = await db
    .select({
      id: drinks.id,
      name: drinks.name,
      ingredientId: drinkIngredients.ingredientId,
      quantity: drinkIngredients.quantity,
      ingredientName: ingredients.name,
      recipeUnit: ingredients.recipeUnit,
    })
    .from(drinks)
    .leftJoin(drinkIngredients, eq(drinkIngredients.drinkId, drinks.id))
    .leftJoin(ingredients, eq(ingredients.id, drinkIngredients.ingredientId));

  const drinkMap = new Map<
    number,
    {
      id: number;
      name: string;
      ingredients: { id: number; name: string; quantity: number; recipeUnit: string }[];
    }
  >();

  for (const row of rows) {
    if (!drinkMap.has(row.id)) {
      drinkMap.set(row.id, { id: row.id, name: row.name, ingredients: [] });
    }
    if (row.ingredientId && row.ingredientName && row.recipeUnit && row.quantity) {
      drinkMap.get(row.id)!.ingredients.push({
        id: row.ingredientId,
        name: row.ingredientName,
        quantity: Number(row.quantity),
        recipeUnit: row.recipeUnit,
      });
    }
  }

  return Array.from(drinkMap.values());
};

export const deleteDrink = async (id: number): Promise<ActionResult> => {
  try {
    await db.delete(drinks).where(eq(drinks.id, id));
    revalidatePath("/drinks");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const createDrink = async (
  values: DrinkInput,
): Promise<ActionResult<{ id: number }>> => {
  try {
    const result = await db.transaction(async (tx) => {
      const [drink] = await tx
        .insert(drinks)
        .values({ name: values.name })
        .returning({ id: drinks.id });

      if (values.ingredients.length > 0) {
        await tx.insert(drinkIngredients).values(
          values.ingredients.map((ing) => ({
            drinkId: drink.id,
            ingredientId: ing.ingredientId,
            quantity: String(ing.quantity),
          })),
        );
      }

      return drink;
    });

    revalidatePath("/drinks");
    return { success: true, data: { id: result.id } };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const updateDrink = async (
  id: number,
  values: DrinkInput,
): Promise<ActionResult> => {
  try {
    await db.transaction(async (tx) => {
      await tx.update(drinks).set({ name: values.name }).where(eq(drinks.id, id));
      await tx.delete(drinkIngredients).where(eq(drinkIngredients.drinkId, id));

      if (values.ingredients.length > 0) {
        await tx.insert(drinkIngredients).values(
          values.ingredients.map((ing) => ({
            drinkId: id,
            ingredientId: ing.ingredientId,
            quantity: String(ing.quantity),
          })),
        );
      }
    });

    revalidatePath("/drinks");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};
