"use server";

import { db } from "@/db";
import { drinks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./types";

type DrinkInput = {
  name: string;
};

export const getDrinks = async () => {
  return db.select().from(drinks);
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
    const [drink] = await db
      .insert(drinks)
      .values(values)
      .returning({ id: drinks.id });
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
    await db.update(drinks).set(values).where(eq(drinks.id, id));
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};
