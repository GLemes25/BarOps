import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import {
  drinkIngredients,
  drinks,
  eventDrinks,
  eventLabor,
  eventMaterials,
  events,
  ingredientComponents,
  ingredients,
  laborCatalog,
  materialCatalog,
} from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
  console.log("Seeding database...");

  // Excluindo dados existentes na ordem correta das Foreign Keys
  console.log("Limpando banco de dados...");
  await db.delete(drinkIngredients);
  await db.delete(ingredientComponents);
  await db.delete(eventDrinks);
  await db.delete(eventLabor);
  await db.delete(eventMaterials);
  await db.delete(events);
  await db.delete(drinks);
  await db.delete(ingredients);
  await db.delete(laborCatalog);
  await db.delete(materialCatalog);

  // 1. Inserindo Todos os Ingredientes (Base + Sub-receitas)
  const insertedIngredients = await db
    .insert(ingredients)
    .values([
      // --- INGREDIENTES ORIGINAIS E BASE ---
      {
        name: "Suco de limão",
        recipeUnit: "ml",
        purchaseUnit: "Garrafa 1L",
        purchaseCost: "20.00",
        yieldQuantity: "1000",
      },
      {
        name: "Vodka",
        recipeUnit: "ml",
        purchaseUnit: "Garrafa 1L",
        purchaseCost: "80.00",
        yieldQuantity: "1000",
      },
      {
        name: "Gin",
        recipeUnit: "ml",
        purchaseUnit: "Garrafa 1L",
        purchaseCost: "120.00",
        yieldQuantity: "1000",
      },
      {
        name: "Rum",
        recipeUnit: "ml",
        purchaseUnit: "Garrafa 1L",
        purchaseCost: "70.00",
        yieldQuantity: "1000",
      },
      {
        name: "Xarope de açúcar",
        recipeUnit: "ml",
        purchaseUnit: "Garrafa 1L",
        purchaseCost: "15.00",
        yieldQuantity: "1000",
      },
      {
        name: "Xarope de gengibre",
        recipeUnit: "ml",
        purchaseUnit: "Garrafa 500ml",
        purchaseCost: "15.00",
        yieldQuantity: "500",
      },
      {
        name: "Emulsificante",
        recipeUnit: "ml",
        purchaseUnit: "Garrafa 500ml",
        purchaseCost: "25.00",
        yieldQuantity: "500",
      },
      {
        name: "Polpa de maracujá",
        recipeUnit: "ml",
        purchaseUnit: "Pacote 1L",
        purchaseCost: "25.00",
        yieldQuantity: "1000",
      },
      {
        name: "Energético tropical",
        recipeUnit: "ml",
        purchaseUnit: "Lata 355ml",
        purchaseCost: "21.30",
        yieldQuantity: "355",
      },
      {
        name: "Água tônica",
        recipeUnit: "ml",
        purchaseUnit: "Garrafa 350ml",
        purchaseCost: "6.30",
        yieldQuantity: "350",
      },
      {
        name: "Gelo",
        recipeUnit: "g",
        purchaseUnit: "Saco 5Kg",
        purchaseCost: "5.00",
        yieldQuantity: "5000",
      },
      {
        name: "Cachaça",
        recipeUnit: "ml",
        purchaseUnit: "Garrafa 1L",
        purchaseCost: "40.00",
        yieldQuantity: "1000",
      },
      {
        name: "Morango",
        recipeUnit: "g",
        purchaseUnit: "Bandeja 250g",
        purchaseCost: "10.00",
        yieldQuantity: "250",
      },
      {
        name: "Uva",
        recipeUnit: "g",
        purchaseUnit: "Cacho 500g",
        purchaseCost: "15.00",
        yieldQuantity: "500",
      },
      {
        name: "Manjericão",
        recipeUnit: "g",
        purchaseUnit: "Maço 100g",
        purchaseCost: "5.00",
        yieldQuantity: "100",
      },
      {
        name: "Saquê",
        recipeUnit: "ml",
        purchaseUnit: "Garrafa 740ml",
        purchaseCost: "55.00",
        yieldQuantity: "740",
      },
      {
        name: "Kiwi",
        recipeUnit: "g",
        purchaseUnit: "Kg",
        purchaseCost: "20.00",
        yieldQuantity: "1000",
      },
      {
        name: "Suco de abacaxi",
        recipeUnit: "ml",
        purchaseUnit: "Caixa 1L",
        purchaseCost: "8.00",
        yieldQuantity: "1000",
      },
      {
        name: "Leite de coco",
        recipeUnit: "ml",
        purchaseUnit: "Garrafa 200ml",
        purchaseCost: "5.00",
        yieldQuantity: "200",
      },
      {
        name: "Licor de pêssego",
        recipeUnit: "ml",
        purchaseUnit: "Garrafa 1L",
        purchaseCost: "60.00",
        yieldQuantity: "1000",
      },
      {
        name: "Suco de laranja",
        recipeUnit: "ml",
        purchaseUnit: "Caixa 1L",
        purchaseCost: "10.00",
        yieldQuantity: "1000",
      },
      {
        name: "Suco de cranberry",
        recipeUnit: "ml",
        purchaseUnit: "Caixa 1L",
        purchaseCost: "15.00",
        yieldQuantity: "1000",
      },
      {
        name: "Tequila",
        recipeUnit: "ml",
        purchaseUnit: "Garrafa 750ml",
        purchaseCost: "120.00",
        yieldQuantity: "750",
      },
      {
        name: "Licor de Laranja",
        recipeUnit: "ml",
        purchaseUnit: "Garrafa 1L",
        purchaseCost: "80.00",
        yieldQuantity: "1000",
      },
      {
        name: "Whiskey Bourbon",
        recipeUnit: "ml",
        purchaseUnit: "Garrafa 1L",
        purchaseCost: "150.00",
        yieldQuantity: "1000",
      },
      {
        name: "Clara pasteurizada",
        recipeUnit: "ml",
        purchaseUnit: "Caixa 1L",
        purchaseCost: "30.00",
        yieldQuantity: "1000",
      },
      {
        name: "Aperol",
        recipeUnit: "ml",
        purchaseUnit: "Garrafa 750ml",
        purchaseCost: "80.00",
        yieldQuantity: "750",
      },
      {
        name: "Espumante",
        recipeUnit: "ml",
        purchaseUnit: "Garrafa 750ml",
        purchaseCost: "60.00",
        yieldQuantity: "750",
      },
      {
        name: "Água com gás",
        recipeUnit: "ml",
        purchaseUnit: "Garrafa 1.5L",
        purchaseCost: "5.00",
        yieldQuantity: "1500",
      },
      {
        name: "Campari",
        recipeUnit: "ml",
        purchaseUnit: "Garrafa 900ml",
        purchaseCost: "65.00",
        yieldQuantity: "900",
      },
      {
        name: "Vermute Tinto",
        recipeUnit: "ml",
        purchaseUnit: "Garrafa 1L",
        purchaseCost: "55.00",
        yieldQuantity: "1000",
      },
      {
        name: "Xarope de mel",
        recipeUnit: "ml",
        purchaseUnit: "Garrafa 500ml",
        purchaseCost: "25.00",
        yieldQuantity: "500",
      },
      {
        name: "Xarope de grenadine",
        recipeUnit: "ml",
        purchaseUnit: "Garrafa 1L",
        purchaseCost: "45.00",
        yieldQuantity: "1000",
      },
      {
        name: "Extrato de baunilha",
        recipeUnit: "ml",
        purchaseUnit: "Frasco 100ml",
        purchaseCost: "40.00",
        yieldQuantity: "100",
      },

      // --- PRE-PREPAROS (Espumas) ---
      {
        name: "Espuma de Gengibre",
        recipeUnit: "ml",
        yieldQuantity: "500",
        isSubRecipe: true,
      },
      {
        name: "Espuma de Limão",
        recipeUnit: "ml",
        yieldQuantity: "500",
        isSubRecipe: true,
      },
      {
        name: "Espuma de Baunilha",
        recipeUnit: "ml",
        yieldQuantity: "500",
        isSubRecipe: true,
      },
    ])
    .returning();

  const byName = Object.fromEntries(
    insertedIngredients.map((i) => [i.name, i.id]),
  );

  console.log(`Inserted ${insertedIngredients.length} ingredients.`);

  // 2. Vinculando as receitas dos Pré-preparos em ingredient_components
  await db.insert(ingredientComponents).values([
    // Espuma de Gengibre (Rende 500ml)
    {
      parentId: byName["Espuma de Gengibre"],
      childId: byName["Xarope de gengibre"],
      quantity: "150",
    },
    {
      parentId: byName["Espuma de Gengibre"],
      childId: byName["Suco de limão"],
      quantity: "100",
    },
    {
      parentId: byName["Espuma de Gengibre"],
      childId: byName["Emulsificante"],
      quantity: "5",
    },
    {
      parentId: byName["Espuma de Gengibre"],
      childId: byName["Água com gás"],
      quantity: "245",
    },

    // Espuma de Limão (Rende 500ml)
    {
      parentId: byName["Espuma de Limão"],
      childId: byName["Suco de limão"],
      quantity: "200",
    },
    {
      parentId: byName["Espuma de Limão"],
      childId: byName["Xarope de açúcar"],
      quantity: "100",
    },
    {
      parentId: byName["Espuma de Limão"],
      childId: byName["Emulsificante"],
      quantity: "5",
    },
    {
      parentId: byName["Espuma de Limão"],
      childId: byName["Água com gás"],
      quantity: "195",
    },

    // Espuma de Baunilha (Rende 500ml)
    {
      parentId: byName["Espuma de Baunilha"],
      childId: byName["Extrato de baunilha"],
      quantity: "20",
    },
    {
      parentId: byName["Espuma de Baunilha"],
      childId: byName["Xarope de açúcar"],
      quantity: "150",
    },
    {
      parentId: byName["Espuma de Baunilha"],
      childId: byName["Emulsificante"],
      quantity: "5",
    },
    {
      parentId: byName["Espuma de Baunilha"],
      childId: byName["Água com gás"],
      quantity: "325",
    },
  ]);

  console.log("Inserted ingredient_components (Sub-receitas configuradas).");

  // 3. Inserindo os Drinks
  const insertedDrinks = await db
    .insert(drinks)
    .values([
      { name: "Caipirinha de Limão" },
      { name: "Caipirinha de Morango" },
      { name: "Caipirinha de Maracujá" },
      { name: "Caipirinha de Uva com Manjericão" },
      { name: "Caipiroska de Limão" },
      { name: "Caipiroska de Morango" },
      { name: "Caipiroska de Maracujá" },
      { name: "Caipiroska de Uva com Manjericão" },
      { name: "Saquerinha de Kiwi" },
      { name: "Mojito" },
      { name: "Piña Colada" },
      { name: "Gin Tônica" },
      { name: "Gin Tropical" },
      { name: "Sex on the Beach" },
      { name: "Margarita" },
      { name: "Whiskey Sour" },
      { name: "Aperol Spritz" },
      { name: "Moscow Mule" },
      { name: "Negroni" },
      { name: "Garibaldi" },
      { name: "Boulevardier" },
      { name: "Penicillin" },
      { name: "Sunset" },
    ])
    .returning();

  const drinkByName = Object.fromEntries(
    insertedDrinks.map((d) => [d.name, d.id]),
  );

  console.log(`Inserted ${insertedDrinks.length} drinks.`);

  // 4. Inserindo as receitas dos drinks
  await db.insert(drinkIngredients).values([
    // Caipirinha de Limão
    {
      drinkId: drinkByName["Caipirinha de Limão"],
      ingredientId: byName["Rum"],
      quantity: "50",
    },
    {
      drinkId: drinkByName["Caipirinha de Limão"],
      ingredientId: byName["Suco de limão"],
      quantity: "30",
    },
    {
      drinkId: drinkByName["Caipirinha de Limão"],
      ingredientId: byName["Xarope de açúcar"],
      quantity: "15",
    },
    {
      drinkId: drinkByName["Caipirinha de Limão"],
      ingredientId: byName["Gelo"],
      quantity: "150",
    },

    // Gin Tônica
    {
      drinkId: drinkByName["Gin Tônica"],
      ingredientId: byName["Gin"],
      quantity: "50",
    },
    {
      drinkId: drinkByName["Gin Tônica"],
      ingredientId: byName["Água tônica"],
      quantity: "150",
    },
    {
      drinkId: drinkByName["Gin Tônica"],
      ingredientId: byName["Gelo"],
      quantity: "150",
    },

    // Mojito
    {
      drinkId: drinkByName["Mojito"],
      ingredientId: byName["Rum"],
      quantity: "50",
    },
    {
      drinkId: drinkByName["Mojito"],
      ingredientId: byName["Suco de limão"],
      quantity: "30",
    },
    {
      drinkId: drinkByName["Mojito"],
      ingredientId: byName["Xarope de açúcar"],
      quantity: "15",
    },
    {
      drinkId: drinkByName["Mojito"],
      ingredientId: byName["Gelo"],
      quantity: "150",
    },

    // Gin Tropical
    {
      drinkId: drinkByName["Gin Tropical"],
      ingredientId: byName["Gin"],
      quantity: "50",
    },
    {
      drinkId: drinkByName["Gin Tropical"],
      ingredientId: byName["Polpa de maracujá"],
      quantity: "40",
    },
    {
      drinkId: drinkByName["Gin Tropical"],
      ingredientId: byName["Energético tropical"],
      quantity: "100",
    },
    {
      drinkId: drinkByName["Gin Tropical"],
      ingredientId: byName["Gelo"],
      quantity: "150",
    },

    // *** Moscow Mule (ATUALIZADO PARA USAR A ESPUMA PRONTA) ***
    {
      drinkId: drinkByName["Moscow Mule"],
      ingredientId: byName["Vodka"],
      quantity: "50",
    },
    {
      drinkId: drinkByName["Moscow Mule"],
      ingredientId: byName["Suco de limão"],
      quantity: "20",
    },
    {
      drinkId: drinkByName["Moscow Mule"],
      ingredientId: byName["Xarope de açúcar"],
      quantity: "15",
    },
    {
      drinkId: drinkByName["Moscow Mule"],
      ingredientId: byName["Espuma de Gengibre"],
      quantity: "50",
    }, // Substituiu os avulsos!
    {
      drinkId: drinkByName["Moscow Mule"],
      ingredientId: byName["Gelo"],
      quantity: "150",
    },

    // Família Caipirinha (Usando Cachaça)
    {
      drinkId: drinkByName["Caipirinha de Morango"],
      ingredientId: byName["Cachaça"],
      quantity: "50",
    },
    {
      drinkId: drinkByName["Caipirinha de Morango"],
      ingredientId: byName["Morango"],
      quantity: "50",
    },
    {
      drinkId: drinkByName["Caipirinha de Morango"],
      ingredientId: byName["Xarope de açúcar"],
      quantity: "20",
    },
    {
      drinkId: drinkByName["Caipirinha de Morango"],
      ingredientId: byName["Gelo"],
      quantity: "150",
    },

    {
      drinkId: drinkByName["Caipirinha de Maracujá"],
      ingredientId: byName["Cachaça"],
      quantity: "50",
    },
    {
      drinkId: drinkByName["Caipirinha de Maracujá"],
      ingredientId: byName["Polpa de maracujá"],
      quantity: "50",
    },
    {
      drinkId: drinkByName["Caipirinha de Maracujá"],
      ingredientId: byName["Xarope de açúcar"],
      quantity: "15",
    },
    {
      drinkId: drinkByName["Caipirinha de Maracujá"],
      ingredientId: byName["Gelo"],
      quantity: "150",
    },

    {
      drinkId: drinkByName["Caipirinha de Uva com Manjericão"],
      ingredientId: byName["Cachaça"],
      quantity: "50",
    },
    {
      drinkId: drinkByName["Caipirinha de Uva com Manjericão"],
      ingredientId: byName["Uva"],
      quantity: "60",
    },
    {
      drinkId: drinkByName["Caipirinha de Uva com Manjericão"],
      ingredientId: byName["Manjericão"],
      quantity: "5",
    },
    {
      drinkId: drinkByName["Caipirinha de Uva com Manjericão"],
      ingredientId: byName["Xarope de açúcar"],
      quantity: "20",
    },
    {
      drinkId: drinkByName["Caipirinha de Uva com Manjericão"],
      ingredientId: byName["Gelo"],
      quantity: "150",
    },

    // Família Caipiroska (Usando Vodka)
    {
      drinkId: drinkByName["Caipiroska de Limão"],
      ingredientId: byName["Vodka"],
      quantity: "50",
    },
    {
      drinkId: drinkByName["Caipiroska de Limão"],
      ingredientId: byName["Suco de limão"],
      quantity: "30",
    },
    {
      drinkId: drinkByName["Caipiroska de Limão"],
      ingredientId: byName["Xarope de açúcar"],
      quantity: "20",
    },
    {
      drinkId: drinkByName["Caipiroska de Limão"],
      ingredientId: byName["Gelo"],
      quantity: "150",
    },

    {
      drinkId: drinkByName["Caipiroska de Morango"],
      ingredientId: byName["Vodka"],
      quantity: "50",
    },
    {
      drinkId: drinkByName["Caipiroska de Morango"],
      ingredientId: byName["Morango"],
      quantity: "50",
    },
    {
      drinkId: drinkByName["Caipiroska de Morango"],
      ingredientId: byName["Xarope de açúcar"],
      quantity: "20",
    },
    {
      drinkId: drinkByName["Caipiroska de Morango"],
      ingredientId: byName["Gelo"],
      quantity: "150",
    },

    {
      drinkId: drinkByName["Caipiroska de Maracujá"],
      ingredientId: byName["Vodka"],
      quantity: "50",
    },
    {
      drinkId: drinkByName["Caipiroska de Maracujá"],
      ingredientId: byName["Polpa de maracujá"],
      quantity: "50",
    },
    {
      drinkId: drinkByName["Caipiroska de Maracujá"],
      ingredientId: byName["Xarope de açúcar"],
      quantity: "15",
    },
    {
      drinkId: drinkByName["Caipiroska de Maracujá"],
      ingredientId: byName["Gelo"],
      quantity: "150",
    },

    {
      drinkId: drinkByName["Caipiroska de Uva com Manjericão"],
      ingredientId: byName["Vodka"],
      quantity: "50",
    },
    {
      drinkId: drinkByName["Caipiroska de Uva com Manjericão"],
      ingredientId: byName["Uva"],
      quantity: "60",
    },
    {
      drinkId: drinkByName["Caipiroska de Uva com Manjericão"],
      ingredientId: byName["Manjericão"],
      quantity: "5",
    },
    {
      drinkId: drinkByName["Caipiroska de Uva com Manjericão"],
      ingredientId: byName["Xarope de açúcar"],
      quantity: "20",
    },
    {
      drinkId: drinkByName["Caipiroska de Uva com Manjericão"],
      ingredientId: byName["Gelo"],
      quantity: "150",
    },

    // Saquerinha
    {
      drinkId: drinkByName["Saquerinha de Kiwi"],
      ingredientId: byName["Saquê"],
      quantity: "75",
    },
    {
      drinkId: drinkByName["Saquerinha de Kiwi"],
      ingredientId: byName["Kiwi"],
      quantity: "60",
    },
    {
      drinkId: drinkByName["Saquerinha de Kiwi"],
      ingredientId: byName["Xarope de açúcar"],
      quantity: "20",
    },
    {
      drinkId: drinkByName["Saquerinha de Kiwi"],
      ingredientId: byName["Gelo"],
      quantity: "150",
    },

    // Clássicos Tropicais
    {
      drinkId: drinkByName["Piña Colada"],
      ingredientId: byName["Rum"],
      quantity: "50",
    },
    {
      drinkId: drinkByName["Piña Colada"],
      ingredientId: byName["Suco de abacaxi"],
      quantity: "50",
    },
    {
      drinkId: drinkByName["Piña Colada"],
      ingredientId: byName["Leite de coco"],
      quantity: "30",
    },
    {
      drinkId: drinkByName["Piña Colada"],
      ingredientId: byName["Xarope de açúcar"],
      quantity: "15",
    },
    {
      drinkId: drinkByName["Piña Colada"],
      ingredientId: byName["Gelo"],
      quantity: "150",
    },

    {
      drinkId: drinkByName["Sex on the Beach"],
      ingredientId: byName["Vodka"],
      quantity: "40",
    },
    {
      drinkId: drinkByName["Sex on the Beach"],
      ingredientId: byName["Licor de pêssego"],
      quantity: "20",
    },
    {
      drinkId: drinkByName["Sex on the Beach"],
      ingredientId: byName["Suco de laranja"],
      quantity: "40",
    },
    {
      drinkId: drinkByName["Sex on the Beach"],
      ingredientId: byName["Suco de cranberry"],
      quantity: "40",
    },
    {
      drinkId: drinkByName["Sex on the Beach"],
      ingredientId: byName["Gelo"],
      quantity: "150",
    },

    {
      drinkId: drinkByName["Sunset"],
      ingredientId: byName["Vodka"],
      quantity: "50",
    },
    {
      drinkId: drinkByName["Sunset"],
      ingredientId: byName["Suco de laranja"],
      quantity: "100",
    },
    {
      drinkId: drinkByName["Sunset"],
      ingredientId: byName["Xarope de grenadine"],
      quantity: "15",
    },
    {
      drinkId: drinkByName["Sunset"],
      ingredientId: byName["Gelo"],
      quantity: "150",
    },

    // Clássicos Internacionais
    {
      drinkId: drinkByName["Margarita"],
      ingredientId: byName["Tequila"],
      quantity: "50",
    },
    {
      drinkId: drinkByName["Margarita"],
      ingredientId: byName["Licor de Laranja"],
      quantity: "20",
    },
    {
      drinkId: drinkByName["Margarita"],
      ingredientId: byName["Suco de limão"],
      quantity: "30",
    },
    {
      drinkId: drinkByName["Margarita"],
      ingredientId: byName["Gelo"],
      quantity: "100",
    },

    {
      drinkId: drinkByName["Whiskey Sour"],
      ingredientId: byName["Whiskey Bourbon"],
      quantity: "50",
    },
    {
      drinkId: drinkByName["Whiskey Sour"],
      ingredientId: byName["Suco de limão"],
      quantity: "30",
    },
    {
      drinkId: drinkByName["Whiskey Sour"],
      ingredientId: byName["Xarope de açúcar"],
      quantity: "15",
    },
    {
      drinkId: drinkByName["Whiskey Sour"],
      ingredientId: byName["Clara pasteurizada"],
      quantity: "15",
    },
    {
      drinkId: drinkByName["Whiskey Sour"],
      ingredientId: byName["Gelo"],
      quantity: "100",
    },

    {
      drinkId: drinkByName["Aperol Spritz"],
      ingredientId: byName["Aperol"],
      quantity: "60",
    },
    {
      drinkId: drinkByName["Aperol Spritz"],
      ingredientId: byName["Espumante"],
      quantity: "90",
    },
    {
      drinkId: drinkByName["Aperol Spritz"],
      ingredientId: byName["Água com gás"],
      quantity: "30",
    },
    {
      drinkId: drinkByName["Aperol Spritz"],
      ingredientId: byName["Gelo"],
      quantity: "150",
    },

    // Família Negroni / Alta Coquetelaria
    {
      drinkId: drinkByName["Negroni"],
      ingredientId: byName["Gin"],
      quantity: "30",
    },
    {
      drinkId: drinkByName["Negroni"],
      ingredientId: byName["Campari"],
      quantity: "30",
    },
    {
      drinkId: drinkByName["Negroni"],
      ingredientId: byName["Vermute Tinto"],
      quantity: "30",
    },
    {
      drinkId: drinkByName["Negroni"],
      ingredientId: byName["Gelo"],
      quantity: "100",
    },

    {
      drinkId: drinkByName["Garibaldi"],
      ingredientId: byName["Campari"],
      quantity: "50",
    },
    {
      drinkId: drinkByName["Garibaldi"],
      ingredientId: byName["Suco de laranja"],
      quantity: "100",
    },
    {
      drinkId: drinkByName["Garibaldi"],
      ingredientId: byName["Gelo"],
      quantity: "150",
    },

    {
      drinkId: drinkByName["Boulevardier"],
      ingredientId: byName["Whiskey Bourbon"],
      quantity: "30",
    },
    {
      drinkId: drinkByName["Boulevardier"],
      ingredientId: byName["Campari"],
      quantity: "30",
    },
    {
      drinkId: drinkByName["Boulevardier"],
      ingredientId: byName["Vermute Tinto"],
      quantity: "30",
    },
    {
      drinkId: drinkByName["Boulevardier"],
      ingredientId: byName["Gelo"],
      quantity: "100",
    },

    {
      drinkId: drinkByName["Penicillin"],
      ingredientId: byName["Whiskey Bourbon"],
      quantity: "50",
    },
    {
      drinkId: drinkByName["Penicillin"],
      ingredientId: byName["Suco de limão"],
      quantity: "25",
    },
    {
      drinkId: drinkByName["Penicillin"],
      ingredientId: byName["Xarope de mel"],
      quantity: "20",
    },
    {
      drinkId: drinkByName["Penicillin"],
      ingredientId: byName["Xarope de gengibre"],
      quantity: "10",
    },
    {
      drinkId: drinkByName["Penicillin"],
      ingredientId: byName["Gelo"],
      quantity: "100",
    },
  ]);

  console.log("Inserted drink_ingredients relationships.");

  // 5. Inserindo o Catálogo Base (Mão de Obra e Materiais)
  await db.insert(laborCatalog).values([
    {
      role: "Bartender",
      baseCost: "180.00",
      baseHours: 5,
      extraHourCost: "60.00",
    },
    {
      role: "Garçom",
      baseCost: "120.00",
      baseHours: 5,
      extraHourCost: "40.00",
    },
    {
      role: "Barback",
      baseCost: "100.00",
      baseHours: 5,
      extraHourCost: "35.00",
    },
  ]);
  console.log("Inserted labor_catalog.");

  await db.insert(materialCatalog).values([
    { name: "Balcão de bar", defaultCost: "150.00" },
    { name: "Coqueteleira", defaultCost: "30.00" },
    { name: "Copo long drink", defaultCost: "2.50" },
    { name: "Copo de shot", defaultCost: "1.50" },
  ]);
  console.log("Inserted material_catalog.");

  console.log(
    "Seed complete. Todos os dados base, espumas e drinks cadastrados!",
  );
}

main().catch((err) => {
  console.error("Erro no seed:", err);
  process.exit(1);
});
