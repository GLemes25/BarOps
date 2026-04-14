import { getIngredients } from "@/actions/ingredient-actions";
import { IngredientsTable } from "./ingredients-table";

const IngredientsPage = async () => {
  const ingredients = await getIngredients();

  return <IngredientsTable initialData={ingredients} />;
};

export default IngredientsPage;
