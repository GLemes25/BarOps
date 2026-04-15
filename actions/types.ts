import { events, laborCatalog, materialCatalog } from "@/db/schema";

export type ActionResult<T = undefined> = {
  success: boolean;
  data?: T;
  error?: string;
};

type EventRow = typeof events.$inferSelect;

export type EventLaborWithCatalog = {
  id: number;
  eventId: number;
  laborCatalogId: number;
  quantity: number;
  role: string;
  baseCost: number;
  baseHours: number;
  extraHourCost: number;
};

export type EventMaterialWithCatalog = {
  id: number;
  eventId: number;
  materialCatalogId: number;
  quantity: number;
  name: string;
  defaultCost: number;
};

export type EventWithRelations = EventRow & {
  labor: EventLaborWithCatalog[];
  materials: EventMaterialWithCatalog[];
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
