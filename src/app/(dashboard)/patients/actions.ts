"use server";

import { fhirServer } from "@/lib/api/axios";
import { FilterFormData } from "@/model/filters";
import format from "string-template";

export async function fetchData(formData: FormData) {
  try {
    const data = JSON.parse(
      formData.getAll("data")[0] as string
    ) as FilterFormData;

    const queries: string[] = [];

    data.filters.forEach((filter) => {
      const template = filter.template;

      const values: Record<string, any> = {};

      filter.params.forEach((param) => {
        values[param.name] = encodeURIComponent(param.value as any);
      });

      console.log({ template, values });

      queries.push(format(template, values));
    });

    console.log(queries);

    const res = await fhirServer.get("/Patient?" + queries, {});
    console.log(res.data);
  } catch (error) {
    console.error(error);
  }
}
