export type CarePlanData = {
  title: string;
  patientId: string;
  requester: string;
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
