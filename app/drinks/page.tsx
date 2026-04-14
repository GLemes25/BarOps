import { getDrinks } from "@/actions/drink-actions";
import { DrinksTable } from "./drinks-table";

const DrinksPage = async () => {
  const drinks = await getDrinks();

  return <DrinksTable initialData={drinks} />;
};

export default DrinksPage;
