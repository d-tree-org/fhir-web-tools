import { fhirR4 } from "@smile-cdr/fhirts";

export type CarePlanData = {
  id: string;
  version: number;
  title?: string;
  patientId: string;
  requester?: string;
  author?: string;
  visitNumber: string;
  period: {
    start?: string | Date | undefined;
    end: string | Date | undefined;
  };
  tags: fhirR4.Coding[];
  activities: CarePlanDataActivity[];
};

export type CarePlanDataActivity = {
  task: string;
  questionnaire: string;
  taskReference?: string;
  carePlanActivityStatus: string;
  taskStatus: string;
  isTaskAndCarePlanSameStatus: boolean;
  taskExists: boolean;
  taskType: "normal" | "scheduled";
};

export type LocationData = {
  id: string;
  name: string;
};

export type SummaryResponse = {
  summaries: SummaryItem[];
  date: string | string[] | null;
};

export type SummaryItem = {
  name: string;
  value: number;
};
