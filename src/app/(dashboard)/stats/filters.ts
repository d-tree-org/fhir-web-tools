import { QueryParam, fixDate } from "./model";
import { format } from "date-fns";

type PatientType =
  | "newly-diagnosed-client"
  | "client-already-on-art"
  | "exposed-infant";

export const createQuestionnaireResponseFilters = (
  questionnaire: string,
  date: string | null,
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
  if (date) {
    query.set(
      "_tag",
      `https://d-tree.org/fhir/created-on-tag|${format(date, "dd/MM/yyyy")}`
    );
  }
  return query.toUrl("/QuestionnaireResponse");
};


export const createPatientFilters = (
  types: PatientType[] | undefined = undefined,
  date: string | null,
  baseFilter: Record<string, string>[]
) => {
  const query = new QueryParam({
    _summary: "count",
  });
  query.fromArray(baseFilter);

  query.remove("date");
  if (date) {
    query.set(
      "_tag",
      `https://d-tree.org/fhir/created-on-tag|${format(date, "dd/MM/yyyy")}`
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
