import { fetchData } from "./actions";
import FilterToolbar from "../../../components/filters/toolbar";
import { patientFilters } from "@/model/filters";
import Content from "./content";

export default async function Page({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  return (
    <main className="container mt-6">
      <FilterToolbar
        action={fetchData}
        filters={patientFilters}
        defaultItem={[]}
      >
        <Content />
      </FilterToolbar>
    </main>
  );
}
