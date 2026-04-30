"use server";

import { db } from "@/db";
import { ingredientComponents, ingredients } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./types";

type ComponentInput = {
  childId: number;
  quantity: number;
};

type IngredientInput = {
  name: string;
  recipeUnit: string;
  isSubRecipe: boolean;
  purchaseUnit?: string;
  purchaseCost?: number;
  yieldQuantity: number;
  components?: ComponentInput[];
};

export type IngredientRecord = {
  id: number;
  name: string;
  recipeUnit: string;
  purchaseUnit: string | null;
  purchaseCost: number | null;
  yieldQuantity: number;
  isSubRecipe: boolean;
  components: { childId: number; quantity: number }[];
};

const computeSubRecipeCost = async (
  components: ComponentInput[],
): Promise<number> => {
  let total = 0;
  for (const comp of components) {
    const [child] = await db
      .select({
        purchaseCost: ingredients.purchaseCost,
        yieldQuantity: ingredients.yieldQuantity,
      })
      .from(ingredients)
      .where(eq(ingredients.id, comp.childId));
    if (child && child.purchaseCost && child.yieldQuantity) {
      const costPerUnit = Number(child.purchaseCost) / Number(child.yieldQuantity);
      total += costPerUnit * comp.quantity;
    }
  }
  return total;
};

export const getIngredients = async (): Promise<IngredientRecord[]> => {
  const rows = await db.select().from(ingredients);
  const compRows = await db.select().from(ingredientComponents);

  return rows.map((row) => ({
    ...row,
    purchaseCost: row.purchaseCost !== null ? Number(row.purchaseCost) : null,
    yieldQuantity: Number(row.yieldQuantity),
    components: compRows
      .filter((c) => c.parentId === row.id)
      .map((c) => ({ childId: c.childId, quantity: Number(c.quantity) })),
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
    let purchaseCost = values.purchaseCost;
    if (values.isSubRecipe && values.components?.length) {
      purchaseCost = await computeSubRecipeCost(values.components);
    }

    const [ingredient] = await db
      .insert(ingredients)
      .values({
        name: values.name,
        recipeUnit: values.recipeUnit,
        purchaseUnit: values.purchaseUnit ?? null,
        purchaseCost: purchaseCost !== undefined ? String(purchaseCost) : null,
        yieldQuantity: String(values.yieldQuantity),
        isSubRecipe: values.isSubRecipe,
      })
      .returning({ id: ingredients.id });

    if (values.isSubRecipe && values.components?.length) {
      try {
        await db.insert(ingredientComponents).values(
          values.components.map((c) => ({
            parentId: ingredient.id,
            childId: c.childId,
            quantity: String(c.quantity),
          })),
        );
      } catch (error) {
        await db.delete(ingredients).where(eq(ingredients.id, ingredient.id));
        throw error;
      }
    }

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
    let purchaseCost = values.purchaseCost;
    if (values.isSubRecipe && values.components?.length) {
      purchaseCost = await computeSubRecipeCost(values.components);
    }

    await db
      .update(ingredients)
      .set({
        name: values.name,
        recipeUnit: values.recipeUnit,
        purchaseUnit: values.purchaseUnit ?? null,
        purchaseCost: purchaseCost !== undefined ? String(purchaseCost) : null,
        yieldQuantity: String(values.yieldQuantity),
        isSubRecipe: values.isSubRecipe,
      })
      .where(eq(ingredients.id, id));

    await db
      .delete(ingredientComponents)
      .where(eq(ingredientComponents.parentId, id));

    if (values.isSubRecipe && values.components?.length) {
      await db.insert(ingredientComponents).values(
        values.components.map((c) => ({
          parentId: id,
          childId: c.childId,
          quantity: String(c.quantity),
        })),
      );
    }

    revalidatePath("/ingredients");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};
