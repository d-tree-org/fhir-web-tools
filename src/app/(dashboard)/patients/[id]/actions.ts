"use server";

import { pushResourceBundle } from "@/lib/fhir/bundle";
import { fetchCarePlan } from "./fetch";
import { CarePlanData, CarePlanDataActivity } from "./types";
import { fhirR4 } from "@smile-cdr/fhirts";

export const fixTasks = async (formData: FormData) => {
  const resourcesToUpdate: fhirR4.Resource[] = [];
  const data = JSON.parse(formData.getAll("data")[0] as string) as {
    careplan: CarePlanData;
    items: CarePlanDataActivity[];
  };
  const mapCarePlan = new Map<string, CarePlanDataActivity>();
  data.items.forEach(async (activity) => {
    if (!activity.taskExists) {
      const task = creatNewTask(data.careplan, activity);
      resourcesToUpdate.push(task);
    }
    if (!activity.isTaskAndCarePlanSameStatus && activity.taskReference) {
      activity.carePlanActivityStatus = activity.taskStatus;
      mapCarePlan.set(activity.taskReference, activity);
    }
  });
  const res = await fetchCarePlan(data.careplan.patientId);
  if (res == null) {
    return null;
  }
  const carePlan = res.carePlan;
  for (let index = 0; index < (carePlan.activity ?? []).length; index++) {
    const activity = carePlan.activity?.[index];
    if (activity === undefined) {
      continue;
    }
    const reference = activity.outcomeReference?.[0]?.reference;
    if (reference == undefined || reference == null) {
      continue;
    }
    const taskId = reference.split("/").pop();
    if (taskId && mapCarePlan.has(taskId) && activity.detail != undefined) {
      activity.detail.status = mapCarePlan.get(taskId)
        ?.carePlanActivityStatus as any;
      carePlan.activity![index] = activity;
    }
  }
  if (mapCarePlan.size > 0) {
    resourcesToUpdate.push(carePlan);
  }
  const bundle = pushResourceBundle(resourcesToUpdate);
  const refetchedCarePlan = await fetchCarePlan(data.careplan.patientId);
  return refetchedCarePlan?.carePlanData;
};

const creatNewTask = (
  carePlan: CarePlanData,
  activity: CarePlanDataActivity
): fhirR4.Task => {
  const task = createGenericTask({
    patientId: carePlan.patientId,
    taskDescription: activity.task,
    questId: activity.questionnaire,
    carePlan: carePlan,
    taskStatus: activity.taskStatus,
  });
  return task;
};

const createGenericTask = ({
  patientId,
  taskDescription,
  questId,
  carePlan,
  taskStatus,
}: {
  patientId: string;
  taskDescription: string;
  questId: string;
  carePlan: CarePlanData;
  taskStatus?: string;
}) => {
  const patientReference = new fhirR4.Reference();
  patientReference.reference = `Patient/${patientId}`;

  const questRef = new fhirR4.Reference();
  questRef.reference = `Questionnaire/${questId}`;

  const period = new fhirR4.Period();
  period.start = new Date();
  period.end = new Date();

  const task = new fhirR4.Task();
  task.resourceType = "Task";
  task.status = (taskStatus as any) ?? fhirR4.Task.StatusEnum.Ready;
  task.intent = fhirR4.Task.IntentEnum.Plan;
  task.priority = "routine";
  task.description = taskDescription;
  task.authoredOn = new Date();
  task.lastModified = new Date();
  task.for = patientReference;
  task.executionPeriod = period;
  task.requester = (carePlan as any).requester;
  task.owner = (carePlan as any).author;
  task.reasonReference = questRef;

  const meta = new fhirR4.Meta();
  meta.tag = carePlan.tags;
  meta.tag.push({
    system: "https://d-tree.org/fhir/careplan-reference",
    code: "CarePlan/" + carePlan.id,
    display: carePlan.title,
  });
  task.meta = meta;
  return task;
};
