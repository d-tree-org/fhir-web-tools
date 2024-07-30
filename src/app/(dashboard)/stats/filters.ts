import { QueryParam } from "./model";
import { format } from "date-fns";

type PatientType =
  | "newly-diagnosed-client"
  | "client-already-on-art"
  | "exposed-infant";

export const createQuestionnaireResponseFilters = (
  questionnaire: string,
  date: string | string[] | null,
  baseFilter: Record<string, string>[],
  hasCount = true,
  extras: Record<string, string>[] = []
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

  query.fromArray(extras);

  return query.toUrl("/QuestionnaireResponse");
};

export const createPatientFilters = (
  types: PatientType[] | undefined = undefined,
  date: string | string[] | null,
  baseFilter: Record<string, string>[],
  options: {
    onlyActive?: boolean;
    hasCount?: boolean;
    formatUrl?: boolean;
  } = {
    hasCount: true,
    onlyActive: false,
    formatUrl: false,
  }
) => {
  const query = new QueryParam({}, options.formatUrl);

  if (options.hasCount == true) {
    query.add("_summary", "count");
  }

  query.fromArray(baseFilter);
  if (options.onlyActive == true) {
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
