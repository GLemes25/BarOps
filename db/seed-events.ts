import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import {
  drinks,
  eventDrinks,
  eventLabor,
  eventMaterials,
  events,
  laborCatalog,
  materialCatalog,
} from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
  console.log("Iniciando seed de Eventos de Teste...");

  // 1. Limpar eventos antigos para não duplicar (ordem das FKs respeitada)
  console.log("Limpando eventos existentes...");
  await db.delete(eventDrinks);
  await db.delete(eventLabor);
  await db.delete(eventMaterials);
  await db.delete(events);

  // 2. Carregar os catálogos (Precisamos do seed.ts original rodado antes!)
  const allDrinks = await db.select().from(drinks);
  const drinkByName = Object.fromEntries(allDrinks.map((d) => [d.name, d.id]));

  const allLabor = await db.select().from(laborCatalog);
  const laborByName = Object.fromEntries(allLabor.map((l) => [l.role, l.id]));

  const allMaterials = await db.select().from(materialCatalog);
  const materialByName = Object.fromEntries(
    allMaterials.map((m) => [m.name, m.id]),
  );

  if (allDrinks.length === 0 || allLabor.length === 0) {
    throw new Error(
      "Catálogos vazios! Rode 'pnpm dlx tsx db/seed.ts' primeiro.",
    );
  }

  // 3. Criar os Eventos
  console.log("Criando festas...");
  const insertedEvents = await db
    .insert(events)
    .values([
      {
        name: "Casamento Maria e João",
        date: new Date("2026-11-20T19:00:00Z"),
        guests: 200,
        durationHours: 8,
        avgDrinksPerPerson: "6.00",
        totalDrinks: 1200, // 200 convidados * 6 drinks
      },
      {
        name: "Festa Corporativa TechCorp",
        date: new Date("2026-12-05T18:00:00Z"),
        guests: 80,
        durationHours: 5,
        avgDrinksPerPerson: "4.00",
        totalDrinks: 320, // 80 convidados * 4 drinks
      },
    ])
    .returning();

  const eventoCasamento = insertedEvents[0];
  const eventoCorporativo = insertedEvents[1];

  // ==========================================
  // ALOCAÇÃO: CASAMENTO MARIA E JOÃO
  // ==========================================
  console.log("Alocando itens para o Casamento...");

  // Drinks do Casamento
  await db.insert(eventDrinks).values([
    { eventId: eventoCasamento.id, drinkId: drinkByName["Moscow Mule"] },
    { eventId: eventoCasamento.id, drinkId: drinkByName["Aperol Spritz"] },
    { eventId: eventoCasamento.id, drinkId: drinkByName["Gin Tônica"] },
    {
      eventId: eventoCasamento.id,
      drinkId: drinkByName["Caipirinha de Limão"],
    },
  ]);

  // Equipe do Casamento (Vai gerar 3 horas extras para cada um!)
  await db.insert(eventLabor).values([
    {
      eventId: eventoCasamento.id,
      laborCatalogId: laborByName["Bartender"],
      quantity: 4,
    },
    {
      eventId: eventoCasamento.id,
      laborCatalogId: laborByName["Barback"],
      quantity: 2,
    },
    {
      eventId: eventoCasamento.id,
      laborCatalogId: laborByName["Garçom"],
      quantity: 3,
    },
  ]);

  // Materiais do Casamento
  await db.insert(eventMaterials).values([
    {
      eventId: eventoCasamento.id,
      materialCatalogId: materialByName["Balcão de bar"],
      quantity: 3,
    },
    {
      eventId: eventoCasamento.id,
      materialCatalogId: materialByName["Coqueteleira"],
      quantity: 6,
    },
  ]);

  // ==========================================
  // ALOCAÇÃO: FESTA CORPORATIVA TECHCORP
  // ==========================================
  console.log("Alocando itens para a Festa Corporativa...");

  // Drinks Corporativos (Foco em tropicais)
  await db.insert(eventDrinks).values([
    { eventId: eventoCorporativo.id, drinkId: drinkByName["Gin Tropical"] },
    { eventId: eventoCorporativo.id, drinkId: drinkByName["Sunset"] },
    {
      eventId: eventoCorporativo.id,
      drinkId: drinkByName["Caipiroska de Morango"],
    },
  ]);

  // Equipe Corporativa (Apenas 5h, sem hora extra)
  await db.insert(eventLabor).values([
    {
      eventId: eventoCorporativo.id,
      laborCatalogId: laborByName["Bartender"],
      quantity: 2,
    },
    {
      eventId: eventoCorporativo.id,
      laborCatalogId: laborByName["Barback"],
      quantity: 1,
    },
  ]);

  // Materiais Corporativos
  await db.insert(eventMaterials).values([
    {
      eventId: eventoCorporativo.id,
      materialCatalogId: materialByName["Balcão de bar"],
      quantity: 1,
    },
    {
      eventId: eventoCorporativo.id,
      materialCatalogId: materialByName["Coqueteleira"],
      quantity: 3,
    },
  ]);

  console.log("Seed de Eventos concluído com sucesso!");
}

main().catch((err) => {
  console.error("Erro no seed de eventos:", err);
  process.exit(1);
});
