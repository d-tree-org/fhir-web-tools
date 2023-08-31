"use server";

import { FilterFormData } from "@/model/filters";
import format from "string-template";

export async function fetchData(formData: FormData) {
  const data = JSON.parse(
    formData.getAll("data")[0] as string
  ) as FilterFormData;

  const queries: string[] = [];

  data.filters.forEach((filter) => {
    const template = filter.template;

    const values: Record<string, any> = {};

    filter.params.forEach((param) => {
      values[param.name] = param.value;
    });

    console.log({ template, values });

    queries.push(format(template, values));
  });

  console.log(queries);
}
