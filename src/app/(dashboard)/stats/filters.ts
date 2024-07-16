import { QueryParam, fixDate } from "./model";
import { format } from "date-fns";

type PatientType =
  | "newly-diagnosed-client"
  | "client-already-on-art"
  | "exposed-infant";

export const createPatientFilters = (
  types: PatientType[] | undefined = undefined,
  date: string | null,
  baseFilter: Record<string, string>[]
) => {
  const allNewlyRegisteredQuery = new QueryParam({
    _summary: "count",
  });
  allNewlyRegisteredQuery.fromArray(baseFilter);

  allNewlyRegisteredQuery.remove("date");
  if (date) {
    allNewlyRegisteredQuery.set(
      "_tag",
      `https://d-tree.org/fhir/created-on-tag|${format(date, "dd/MM/yyyy")}`
    );
  }
  if (types) {
    allNewlyRegisteredQuery.add(
      "_tag",
      `https://d-tree.org/fhir/patient-meta-tag|${types.join(",")}`
    );
  }
  return allNewlyRegisteredQuery.toUrl("/Patient");
};
