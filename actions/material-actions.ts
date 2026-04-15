"use server";

import { db } from "@/db";
import { materialCatalog } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./types";

type MaterialInput = {
  name: string;
  defaultCost: number;
};

export const getMaterials = async () => {
  const rows = await db.select().from(materialCatalog);
  return rows.map((row) => ({
    ...row,
    defaultCost: Number(row.defaultCost),
  }));
};

export const deleteMaterial = async (id: number): Promise<ActionResult> => {
  try {
    await db.delete(materialCatalog).where(eq(materialCatalog.id, id));
    revalidatePath("/materials");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const createMaterial = async (
  values: MaterialInput,
): Promise<ActionResult<{ id: number }>> => {
  try {
    const [material] = await db
      .insert(materialCatalog)
      .values({ ...values, defaultCost: String(values.defaultCost) })
      .returning({ id: materialCatalog.id });
    revalidatePath("/materials");
    return { success: true, data: { id: material.id } };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const updateMaterial = async (
  id: number,
  values: MaterialInput,
): Promise<ActionResult> => {
  try {
    await db
      .update(materialCatalog)
      .set({ ...values, defaultCost: String(values.defaultCost) })
      .where(eq(materialCatalog.id, id));
    revalidatePath("/materials");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};
