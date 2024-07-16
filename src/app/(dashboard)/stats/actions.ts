"use server";

import { fetchBundle } from "@/lib/fhir/bundle";
import { LocationData, SummaryItem } from "@/lib/models/types";
import { FilterFormData } from "@/model/filters";
import { fhirR4 } from "@smile-cdr/fhirts";
import { fixDate } from "./model";
import {
  createPatientFilters,
  createQuestionnaireResponseFilters,
} from "./filters";
import { eachDayOfInterval } from "@/lib/utils";

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
  let rawDate: string | string[] | null = null;
  const baseFilter = data.filters.map((filter) => {
    const temp: Record<string, string> = {};

    if (filter.template == "_tag_location") {
      console.log(filter);
      const template = `http://smartregister.org/fhir/location-tag|${
        filter.params[0].value ?? ""
      }`;
      temp["_tag"] = template;
    } else if (filter.template == "date") {
      rawDate =
        filter.params.find((e) => e.name == "date")?.value?.split("T")[0] ??
        null;
    } else if (filter.template == "dateRange") {
      const value = filter.params[0].value;
      if (value) {
        const { from, to } = value as any;
        console.log(from, to);

        if (from && to) {
          const start = new Date(from.split("T")[0]);
          const end = new Date(to.split("T")[0]);
          console.log({ start, end });

          rawDate = eachDayOfInterval({
            start,
            end,
          }).map((e) => {
            console.log(e);

            return e.toISOString().split("T")[0];
          });
        } else if (from) {
          rawDate = [from.split("T")[0]];
        }
      }
    } else {
      temp[filter.template] = filter.params[0].value ?? "";
    }

    return temp;
  });

  if (rawDate) {
    rawDate = fixDate(rawDate);
  }

  const bundle = await fetchBundle([
    createQuestionnaireResponseFilters(
      "patient-finish-visit",
      rawDate,
      baseFilter
    ),
    createPatientFilters(["newly-diagnosed-client"], rawDate, baseFilter),
    createPatientFilters(["client-already-on-art"], rawDate, baseFilter),
    createPatientFilters(["exposed-infant"], rawDate, baseFilter),
    createQuestionnaireResponseFilters(
      "exposed-infant-milestone-hiv-test",
      rawDate,
      baseFilter
    ),
    createQuestionnaireResponseFilters(
      "art-client-viral-load-collection",
      rawDate,
      baseFilter
    ),
  ]);
  const summary: string[] = [
    "Total visits",
    "Newly diagnosed clients (created)",
    "Already on Art (created)",
    "Exposed infant (created)",
    "Milestone answered",
    "VL collected answered",
  ];
  console.log(JSON.stringify(bundle));

  return { summaries: getResults(bundle, summary), date: rawDate };
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
  params: Record<string, string | number | string>
) => {
  return `${resources}?${Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&")}`;
};
