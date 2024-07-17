import { fhirR4 } from "@smile-cdr/fhirts";
import { QueryParam, fixDate } from "./model";
import { format } from "date-fns";

type PatientType =
  | "newly-diagnosed-client"
  | "client-already-on-art"
  | "exposed-infant";

export const createQuestionnaireResponseFilters = (
  questionnaire: string,
  date: string | string[] | null,
  baseFilter: Record<string, string>[],
  hasCount = true
) => {
  const query = new QueryParam({
    questionnaire: questionnaire,
  });

  if (hasCount) {
    query.set("_summary", "count");
  }
  query.fromArray(baseFilter);

  query.remove("date");
  query.remove("dateRange");

  if (date) {
    if (typeof date === "string") {
      date = [date];
    }
    query.add(
      "_tag",
      date
        .map(
          (d) =>
            `https://d-tree.org/fhir/created-on-tag|${format(d, "dd/MM/yyyy")}`
        )
        .join(",")
    );
  }
  return query.toUrl("/QuestionnaireResponse");
};

export const createPatientFilters = (
  types: PatientType[] | undefined = undefined,
  date: string | string[] | null,
  baseFilter: Record<string, string>[],
  onlyActive = false
) => {
  const query = new QueryParam({
    _summary: "count",
  });
  query.fromArray(baseFilter);
  if (onlyActive) {
    query.add("active", true);
  }
  query.remove("date");
  query.remove("dateRange");
  if (date) {
    if (typeof date === "string") {
      date = [date];
    }
    query.add(
      "_tag",
      date
        .map(
          (d) =>
            `https://d-tree.org/fhir/created-on-tag|${format(d, "dd/MM/yyyy")}`
        )
        .join(",")
    );
  }
  if (types) {
    query.add(
      "_tag",
      `https://d-tree.org/fhir/patient-meta-tag|${types.join(",")}`
    );
  }
  return query.toUrl("/Patient");
};
