import { getLabor } from "@/actions/labor-actions";
import { LaborTable } from "./labor-table";

const LaborPage = async () => {
  const labor = await getLabor();

  return <LaborTable initialData={labor} />;
};

export default LaborPage;
