import { fetchData, fetchRequiredData } from "./actions";
import FilterToolbar from "../../../components/filters/toolbar";
import { patientFilters } from "@/model/filters";
import Content from "./content";

export default async function Page({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const data = await fetchRequiredData();
  return (
    <main className="container mt-6">
      <FilterToolbar
        action={fetchData}
        filters={patientFilters}
        defaultItem={[]}
        prefillData={data}
      >
        <Content locationMap={data.locationMap} />
      </FilterToolbar>
    </main>
  );
}
