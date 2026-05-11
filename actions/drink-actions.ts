"use server";

import { db } from "@/db";
import { drinks, drinkIngredients, eventDrinks, ingredients } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./types";

type IngredientEntry = {
  ingredientId: number;
  quantity: number;
};

type DrinkInput = {
  name: string;
  parentId?: number | null;
  ingredients: IngredientEntry[];
};

export const getDrinks = async () => {
  const rows = await db
    .select({
      id: drinks.id,
      name: drinks.name,
      parentId: drinks.parentId,
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
      parentId: number | null;
      ingredients: { id: number; name: string; quantity: number; recipeUnit: string }[];
    }
  >();

  for (const row of rows) {
    if (!drinkMap.has(row.id)) {
      drinkMap.set(row.id, { id: row.id, name: row.name, parentId: row.parentId, ingredients: [] });
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

  const allDrinks = Array.from(drinkMap.values());

  const variantsMap = new Map<number, { id: number; name: string }[]>();
  for (const drink of allDrinks) {
    if (drink.parentId !== null) {
      if (!variantsMap.has(drink.parentId)) variantsMap.set(drink.parentId, []);
      variantsMap.get(drink.parentId)!.push({ id: drink.id, name: drink.name });
    }
  }

  return allDrinks.map((drink) => ({
    ...drink,
    variants: variantsMap.get(drink.id) ?? [],
  }));
};

export const deleteDrink = async (id: number): Promise<ActionResult> => {
  try {
    const [usedInEvent] = await db
      .select({ id: eventDrinks.id })
      .from(eventDrinks)
      .where(eq(eventDrinks.drinkId, id))
      .limit(1);

    if (usedInEvent) {
      return {
        success: false,
        error: "Não é possível excluir: esta bebida está sendo usada em um ou mais eventos.",
      };
    }

    const [hasChildren] = await db
      .select({ id: drinks.id })
      .from(drinks)
      .where(eq(drinks.parentId, id))
      .limit(1);

    if (hasChildren) {
      return {
        success: false,
        error: "Não é possível excluir: esta bebida possui variações. Altere ou exclua as variações primeiro.",
      };
    }

    await db.delete(drinkIngredients).where(eq(drinkIngredients.drinkId, id));
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
    const parentId = values.parentId || null;

    const [drink] = await db
      .insert(drinks)
      .values({ name: values.name, parentId })
      .returning({ id: drinks.id });

    if (values.ingredients.length > 0) {
      try {
        await db.insert(drinkIngredients).values(
          values.ingredients.map((ing) => ({
            drinkId: drink.id,
            ingredientId: ing.ingredientId,
            quantity: String(ing.quantity),
          })),
        );
      } catch (error) {
        await db.delete(drinks).where(eq(drinks.id, drink.id));
        throw error;
      }
    }

    revalidatePath("/drinks");
    return { success: true, data: { id: drink.id } };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const updateDrink = async (
  id: number,
  values: DrinkInput,
): Promise<ActionResult> => {
  try {
    const newParentId = values.parentId || null;

    if (newParentId === id) {
      return { success: false, error: "Um drink não pode ser pai de si mesmo" };
    }

    const children = await db
      .select({ id: drinks.id })
      .from(drinks)
      .where(eq(drinks.parentId, id));

    await db.delete(drinkIngredients).where(eq(drinkIngredients.drinkId, id));

    if (newParentId !== null && children.length > 0) {
      await db
        .update(drinks)
        .set({ parentId: newParentId })
        .where(eq(drinks.parentId, id));
    }

    await db
      .update(drinks)
      .set({ name: values.name, parentId: newParentId })
      .where(eq(drinks.id, id));

    if (values.ingredients.length > 0) {
      await db.insert(drinkIngredients).values(
        values.ingredients.map((ing) => ({
          drinkId: id,
          ingredientId: ing.ingredientId,
          quantity: String(ing.quantity),
        })),
      );
    }

    revalidatePath("/drinks");
    return { success: true };
  } catch {
    return { success: false, error: "Erro interno ao atualizar a bebida." };
  }
};
