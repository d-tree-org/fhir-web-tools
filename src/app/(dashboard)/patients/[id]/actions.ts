"use server";

import { fetchCarePlan } from "./fetch";
import { CarePlanData, CarePlanDataActivity } from "./types";
import { fhirR4 } from "@smile-cdr/fhirts";
export const fixTasks = async (formData: FormData) => {
  const data = JSON.parse(formData.getAll("data")[0] as string) as {
    careplan: CarePlanData;
    items: CarePlanDataActivity[];
  };
  data.items.forEach(async (activity) => {
    if (!activity.taskExists) {
      const task = await creatNewTask(data.careplan, activity);
      console.log(task);
    }
  });
  return await fetchCarePlan(data.careplan.patientId);
};

const creatNewTask = async (
  carePlan: CarePlanData,
  activity: CarePlanDataActivity
): Promise<fhirR4.Task> => {
  const task = createGenericTask({
    patientId: carePlan.patientId,
    taskDescription: activity.task,
    questId: activity.questionnaire,
    carePlan: carePlan,
  });
  return task;
};

const createGenericTask = ({
  patientId,
  taskDescription,
  questId,
  carePlan,
}: {
  patientId: string;
  taskDescription: string;
  questId: string;
  carePlan: CarePlanData;
}) => {
  const patientReference = new fhirR4.Reference();
  patientReference.reference = `Patient/${patientId}`;
  const period = new fhirR4.Period();
  period.start = new Date();
  period.end = new Date();
  const task = new fhirR4.Task();
  task.status = fhirR4.Task.StatusEnum.Ready;
  task.intent = fhirR4.Task.IntentEnum.Plan;
  task.priority = "routine";
  task.description = taskDescription;
  task.authoredOn = new Date();
  task.lastModified = new Date();
  task.for = patientReference;
  task.executionPeriod = period;
  task.requester = (carePlan as any).requester;
  return task;
};
