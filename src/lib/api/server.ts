import { fetchBundle } from "../fhir/bundle";
import { eachDayOfInterval, paramGenerator } from "../utils";
import { fhirR4 } from "@smile-cdr/fhirts";
import { LocationData, SummaryItem } from "@/lib/models/types";
import { FilterFormItem } from "@/model/filters";
import { fixDate } from "@/app/(dashboard)/stats/model";
import format from "string-template";

export async function fetchLocations() {
  const locationQuery = paramGenerator("/Location", {
    _count: 100,
    type: "https://d-tree.org/fhir/location-type|facility",
  });
  var bundle = await fetchBundle([locationQuery]);
  const locations = getLocationData(
    bundle.entry?.[0]?.resource as fhirR4.Bundle
  );
  return locations;
}

export const generteBaseFilter = (filters: FilterFormItem[]) => {
  let rawDate: string | string[] | null = null;

  const baseFilter = filters.map((filter) => {
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
      if (filter.template.includes("={")) {
        const values: Record<string, any> = {};

        filter.params.forEach((param) => {
          values[param.name] = encodeURIComponent(param.value as any);
        });

        const value = format(filter.template, values);
        temp[value.split("=")[0]] = value.split("=")[1];
      } else {
        temp[filter.template] = filter.params[0].value ?? "";
      }
    }

    return temp;
  });

  if (rawDate) {
    rawDate = fixDate(rawDate);
  }

  return {
    baseFilter,
    rawDate,
  };
};

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
