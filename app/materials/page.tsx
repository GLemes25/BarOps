import { getMaterials } from "@/actions/material-actions";
import { MaterialsTable } from "./materials-table";

const MaterialsPage = async () => {
  const materials = await getMaterials();

  return <MaterialsTable initialData={materials} />;
};

export default MaterialsPage;
