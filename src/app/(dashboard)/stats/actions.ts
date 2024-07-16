"use server";

import { fetchBundle } from "@/lib/fhir/bundle";
import { LocationData, SummaryItem } from "@/lib/models/types";
import { FilterFormData } from "@/model/filters";
import { fhirR4 } from "@smile-cdr/fhirts";
import { format } from "date-fns";

export async function fetchRequiredData() {
  const locationQuery = paramGenerator("/Location", {
    _count: 100,
    type: "https://d-tree.org/fhir/location-type|facility",
  });
  var bundle = await fetchBundle([locationQuery]);
  const locations = getLocationData(
    bundle.entry?.[0]?.resource as fhirR4.Bundle
  );
  return {
    locations,
  };
}

export async function fetchData(formData: FormData) {
  const data = JSON.parse(
    formData.getAll("data")[0] as string
  ) as FilterFormData;

  console.log(JSON.stringify(data));
  const baseFilter = data.filters.map((filter) => {
    const temp: Record<string, string> = {};
    if (filter.template == "_tag_location") {
      const template = `http://smartregister.org/fhir/location-tag|${
        filter.params[0].value ?? ""
      }`;
      temp["_tag"] = template;
    } else {
      temp[filter.template] = filter.params[0].value ?? "";
    }
    return temp;
  });
  const query: Record<string, string> = {
    _summary: "count",
    questionnaire: "patient-finish-visit",
  };
  baseFilter.forEach((filter) => {
    Object.assign(query, filter);
  });
  if (query["date"]) {
    query["authored"] = format(query["date"], "yyyy-MM-dd");
    delete query["date"];
  }
  const allVisits = paramGenerator("/QuestionnaireResponse", query);
  const bundle = await fetchBundle([allVisits]);
  const summary: string[] = ["Total visits"];
  console.log(JSON.stringify(bundle));

  return getResults(bundle, summary);
}

const getLocationData = (bundle: fhirR4.Bundle | undefined): LocationData[] => {
  if (bundle == undefined) {
    return [];
  }
  return (
    bundle.entry?.map((entry) => {
      return {
        id: entry.resource?.id ?? "",
        name: (entry.resource as fhirR4.Location)?.name ?? "",
      };
    }) ?? []
  );
};

const getResults = (
  bundle: fhirR4.Bundle | undefined,
  summary: string[]
): SummaryItem[] => {
  if (bundle == undefined) {
    return [];
  }
  return (
    bundle.entry?.map((entry, idx) => {
      return {
        name: summary[idx],
        value: (entry.resource as fhirR4.Bundle)?.total ?? 0,
      };
    }) ?? []
  );
};

const paramGenerator = (
  resources: string,
  params: Record<string, string | number>
) => {
  return `${resources}?${Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&")}`;
};
