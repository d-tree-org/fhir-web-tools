"use server";

import { fhirServer } from "@/lib/api/axios";
import { FilterFormData } from "@/model/filters";
import format from "string-template";
import { Patient } from "./types";

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
    return (
      res.data.entry?.map((entry: any) => createPatient(entry.resource)) ?? []
    );
  } catch (error) {
    console.error(error);
    return [];
  }
}

const createPatient = (data: any): Patient => {
  return {
    id: data.id,
    identifier: data.identifier[0]?.value ?? "NA",
    name: data.name[0].given[0] + " " + data.name[0].family,
    gender: data.gender,
    birthDate: data.birthDate,
    phoneNumbers:
      data.telecom?.map((value: any) => {
        var array = value.value?.split("|");
        return {
          number: array[1],
          owner: array[2],
        };
      }) ?? [],
    active: data.active,
    address:
      data.address?.map((value: any) => ({
        facility: value.district ?? "NA",
        physical: data.address[0]?.text ?? "NA",
      })) ?? [],
    registrationDate:
      data.meta.tag.find(
        (e: any) => e.system === "https://d-tree.org/fhir/created-on-tag"
      )?.code ?? "NA",
    registratedBy: data.generalPractitioner[0]?.display ?? "NA",
  };
};
