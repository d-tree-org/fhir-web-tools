import { fhirR4 } from "@smile-cdr/fhirts";

export type CarePlanData = {
  id: string;
  title?: string;
  patientId: string;
  requester?: string;
  author?: string;
  visitNumber: string;
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
