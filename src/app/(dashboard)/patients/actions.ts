"use server";

import { fhirServer } from "@/lib/api/axios";
import { FilterFormData } from "@/model/filters";
import { createPatient } from "@/lib/fhir/patient";
import { fetchLocations, generteBaseFilter } from "@/lib/api/server";
import { createPatientFilters } from "../stats/filters";

export async function fetchRequiredData() {
  const locations = await fetchLocations();
  const locationMap = new Map(
    locations.map((location) => [location.id, location.name])
  );
  return {
    locations,
    locationMap,
  };
}

export async function fetchData(formData: FormData) {
  try {
    const data = JSON.parse(
      formData.getAll("data")[0] as string
    ) as FilterFormData;

    const { rawDate, baseFilter } = generteBaseFilter(data.filters);

    const query = createPatientFilters(undefined, rawDate, baseFilter, {
      hasCount: false,
      onlyActive: true,
      formatUrl: true,
    });

    console.log(query);

    const res = await fhirServer.get(query);
    return (
      res.data.entry?.map((entry: any) => createPatient(entry.resource)) ?? []
    );
  } catch (error) {
    console.error(error);
    return [];
  }
}
