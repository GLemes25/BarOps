import { eventLabor, eventMaterials, events } from "@/db/schema";

export type ActionResult<T = undefined> = {
  success: boolean;
  data?: T;
  error?: string;
};

type EventRow = typeof events.$inferSelect;
type EventLaborRow = typeof eventLabor.$inferSelect;
type EventMaterialRow = typeof eventMaterials.$inferSelect;

export type EventWithRelations = EventRow & {
  labor: EventLaborRow[];
  materials: EventMaterialRow[];
};

export type EventCosts = {
  totalDrinks: number;
  laborCost: number;
  materialsCost: number;
  foamIngredientsCost: number;
};

export type CreateEventInput = {
  name: string;
  date: Date;
  guests: number;
  durationHours: number;
  avgDrinksPerPerson: string;
  totalDrinks: number;
};
