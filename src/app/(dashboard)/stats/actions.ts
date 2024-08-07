"use server";

import { fetchBundle } from "@/lib/fhir/bundle";
import { SummaryItem } from "@/lib/models/types";
import { FilterFormData } from "@/model/filters";
import { fhirR4 } from "@smile-cdr/fhirts";
import { fixDate } from "./model";
import {
  createPatientFilters,
  createQuestionnaireResponseFilters,
} from "./filters";
import { eachDayOfInterval } from "@/lib/utils";
import { fetchLocations } from "@/lib/api/server";

export async function fetchRequiredData() {
  const locations = await fetchLocations();
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
      baseFilter,
      false
    ),
    createQuestionnaireResponseFilters(
      "art-client-viral-load-collection",
      rawDate,
      baseFilter,
      false
    ),
    createPatientFilters(["newly-diagnosed-client"], null, baseFilter, {
      hasCount: true,
    }),
    createPatientFilters(["client-already-on-art"], null, baseFilter, {
      hasCount: true,
    }),
    createPatientFilters(["exposed-infant"], null, baseFilter, {
      hasCount: true,
    }),
    createQuestionnaireResponseFilters(
      "patient-finish-visit",
      rawDate,
      baseFilter,
      true,
      [
        {
          "subject:Patient._tag":
            "https://d-tree.org/fhir/patient-meta-tag|newly-diagnosed-client",
        },
      ]
    ),
    createQuestionnaireResponseFilters(
      "patient-finish-visit",
      rawDate,
      baseFilter,
      true,
      [
        {
          "subject:Patient._tag":
            "https://d-tree.org/fhir/patient-meta-tag|client-already-on-art",
        },
      ]
    ),
    createQuestionnaireResponseFilters(
      "patient-finish-visit",
      rawDate,
      baseFilter,
      true,
      [
        {
          "subject:Patient._tag":
            "https://d-tree.org/fhir/patient-meta-tag|exposed-infant",
        },
      ]
    ),
  ]);
  const summary: string[] = [
    "Total visits",
    "Newly diagnosed clients (new)",
    "Already on Art (new)",
    "Exposed infant (new)",
    "Milestone answered",
    "VL collected answered",
    "Newly diagnosed clients (all)",
    "Already on Art (all)",
    "Exposed infant (all)",
    "Newly diagnosed clients (visits)",
    "Already on Art (visits)",
    "Exposed infant (visits)",
  ];

  return {
    summaries: getResults(bundle, summary, [
      {
        index: 4,
        filter: (resource) => {
          return (
            resource?.item?.[0]?.item?.find(
              (e) => e.linkId == "able-to-conduct-test"
            )?.answer?.[0]?.valueBoolean ?? false
          );
        },
      },
      {
        index: 5,
        filter: (resource) => {
          return (
            (resource?.item ?? [])?.find(
              (e) => e.linkId == "viral-load-collection-confirmation"
            )?.answer?.[0]?.valueBoolean ?? false
          );
        },
      },
    ]),
    date: rawDate,
  };
}

const getResults = (
  bundle: fhirR4.Bundle | undefined,
  summary: string[],
  filters: {
    index: number;
    filter: (resource?: fhirR4.QuestionnaireResponse) => boolean;
  }[]
): SummaryItem[] => {
  if (bundle == undefined) {
    return [];
  }
  return (
    bundle.entry?.map((entry, idx) => {
      const filter = filters.find((e) => e.index == idx)?.filter;
      if (filter) {
        const items = (entry.resource as fhirR4.Bundle)?.entry ?? [];
        const unique = [
          ...new Map(
            items.map((v) => [
              (v.resource as fhirR4.QuestionnaireResponse).subject?.reference,
              v.resource as fhirR4.QuestionnaireResponse,
            ])
          ).values(),
        ];
        return {
          name: summary[idx],
          value: unique?.filter(filter).length ?? 0,
        };
      }
      return {
        name: summary[idx],
        value: (entry.resource as fhirR4.Bundle)?.total ?? 0,
      };
    }) ?? []
  );
};
