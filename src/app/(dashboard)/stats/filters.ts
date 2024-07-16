import { QueryParam } from "./model";
import { format } from "date-fns";

type PatientType =
  | "newly-diagnosed-client"
  | "client-already-on-art"
  | "exposed-infant";

export const createPatientFilters = (
  types: PatientType[] | undefined = undefined,
  baseFilter: Record<string, string>[]
) => {
  const allNewlyRegisteredQuery = new QueryParam({
    _summary: "count",
  });
  allNewlyRegisteredQuery.fromArray(baseFilter);

  if (allNewlyRegisteredQuery.has("date")) {
    allNewlyRegisteredQuery.set(
      "_tag",
      `https://d-tree.org/fhir/created-on-tag|${format(
        allNewlyRegisteredQuery.get("date")!,
        "dd/MM/yyyy"
      )}`
    );
    allNewlyRegisteredQuery.remove("date");
  }
  if (types) {
    allNewlyRegisteredQuery.add(
      "_tag",
      `https://d-tree.org/fhir/patient-meta-tag|${types.join(",")}`
    );
  }
  return allNewlyRegisteredQuery.toUrl("/Patient");
};
