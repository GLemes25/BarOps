"use server";

import { db } from "@/db";
import { laborCatalog } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./types";

type LaborInput = {
  role: string;
  baseCost: number;
  baseHours: number;
  extraHourCost: number;
};

export const getLabor = async () => {
  const rows = await db.select().from(laborCatalog);
  return rows.map((row) => ({
    ...row,
    baseCost: Number(row.baseCost),
    extraHourCost: Number(row.extraHourCost),
  }));
};

export const deleteLabor = async (id: number): Promise<ActionResult> => {
  try {
    await db.delete(laborCatalog).where(eq(laborCatalog.id, id));
    revalidatePath("/labor");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const createLabor = async (
  values: LaborInput,
): Promise<ActionResult<{ id: number }>> => {
  try {
    const [labor] = await db
      .insert(laborCatalog)
      .values({
        ...values,
        baseCost: String(values.baseCost),
        extraHourCost: String(values.extraHourCost),
      })
      .returning({ id: laborCatalog.id });
    revalidatePath("/labor");
    return { success: true, data: { id: labor.id } };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const updateLabor = async (
  id: number,
  values: LaborInput,
): Promise<ActionResult> => {
  try {
    await db
      .update(laborCatalog)
      .set({
        ...values,
        baseCost: String(values.baseCost),
        extraHourCost: String(values.extraHourCost),
      })
      .where(eq(laborCatalog.id, id));
    revalidatePath("/labor");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};
