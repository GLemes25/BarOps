"use server";

import { db } from "@/db";
import { eventMaterials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./types";

type MaterialInput = {
  name: string;
  quantity: number;
  costPerUnit: number;
};

export const getMaterials = async () => {
  const rows = await db.select().from(eventMaterials);
  return rows.map((row) => ({
    ...row,
    costPerUnit: Number(row.costPerUnit),
  }));
};

export const deleteMaterial = async (id: number): Promise<ActionResult> => {
  try {
    await db.delete(eventMaterials).where(eq(eventMaterials.id, id));
    revalidatePath("/materials");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const createMaterial = async (
  eventId: number,
  values: MaterialInput,
): Promise<ActionResult<{ id: number }>> => {
  try {
    const [material] = await db
      .insert(eventMaterials)
      .values({ ...values, eventId, costPerUnit: String(values.costPerUnit) })
      .returning({ id: eventMaterials.id });
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
      .update(eventMaterials)
      .set({ ...values, costPerUnit: String(values.costPerUnit) })
      .where(eq(eventMaterials.id, id));
    revalidatePath("/materials");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};
