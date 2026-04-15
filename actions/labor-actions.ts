"use server";

import { db } from "@/db";
import { eventLabor } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./types";

type LaborInput = {
  role: string;
  quantity: number;
  costPerPerson: number;
};

export const getLabor = async () => {
  const rows = await db.select().from(eventLabor);
  return rows.map((row) => ({
    ...row,
    costPerPerson: Number(row.costPerPerson),
  }));
};

export const deleteLabor = async (id: number): Promise<ActionResult> => {
  try {
    await db.delete(eventLabor).where(eq(eventLabor.id, id));
    revalidatePath("/labor");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const createLabor = async (
  eventId: number,
  values: LaborInput,
): Promise<ActionResult<{ id: number }>> => {
  try {
    const [labor] = await db
      .insert(eventLabor)
      .values({ ...values, eventId, costPerPerson: String(values.costPerPerson) })
      .returning({ id: eventLabor.id });
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
      .update(eventLabor)
      .set({ ...values, costPerPerson: String(values.costPerPerson) })
      .where(eq(eventLabor.id, id));
    revalidatePath("/labor");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};
