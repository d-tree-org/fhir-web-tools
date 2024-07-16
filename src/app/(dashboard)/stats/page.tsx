import React from "react";
import { fetchData, fetchRequiredData } from "./actions";
import FilterToolbar from "@/components/filters/toolbar";
import { statsFilters } from "@/model/filters";
import Content from "./content";

type Props = {};

const Page = async (props: Props) => {
  const data = await fetchRequiredData();
  return (
    <main className="container mt-6">
      <FilterToolbar
        action={fetchData}
        filters={statsFilters}
        defaultItem={{
          date: null,
          summaries: [],
        }}
        prefillData={data}
      >
        <Content />
      </FilterToolbar>
    </main>
  );
};

export default Page;
