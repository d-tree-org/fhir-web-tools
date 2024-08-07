"use server";

import { BinaryPatchData, pushResourceBundle } from "@/lib/fhir/bundle";
import { createDetails, fetchCarePlan } from "./fetch";
import {
  CarePlanData,
  CarePlanDataActivity,
} from "../../../../lib/models/types";
import { fhirR4 } from "@smile-cdr/fhirts";
import { mapCarePlanToTask } from "@/lib/fhir/tasks";
import { createJsonPatchUpdate } from "@/lib/utils";
import { fhirServer } from "@/lib/api/axios";

export const fixTasks = async (formData: FormData) => {
  const resourcesToUpdate: (fhirR4.Resource | BinaryPatchData)[] = [];
  const data = JSON.parse(formData.getAll("data")[0] as string) as {
    careplan: CarePlanData;
    items: CarePlanDataActivity[];
  };
  const mapCarePlan = new Map<string, CarePlanDataActivity>();
  for (const activity of data.items) {
    if (!activity.taskExists) {
      console.log(activity);
      if (
        activity.taskReference == undefined ||
        activity.taskReference == null
      ) {
        continue;
      }
      activity.taskStatus = mapCarePlanToTask(activity.carePlanActivityStatus);
      const task = creatNewTask(data.careplan, activity);
      resourcesToUpdate.push(task);
    } else {
      if (!activity.isTaskAndCarePlanSameStatus && activity.taskReference) {
        activity.taskStatus = mapCarePlanToTask(
          activity.carePlanActivityStatus
        );
        mapCarePlan.set(activity.taskReference, activity);
      }
    }
  }
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
      const taskUpdateBundle = {
        path: `Task/${taskId}`,
        isBinary: true,
        data: createJsonPatchUpdate([
          {
            op: "replace",
            path: "/status",
            value: mapCarePlan.get(taskId)?.taskStatus,
          },
        ]),
      };
      resourcesToUpdate.push(taskUpdateBundle);
    }
  }
  if (mapCarePlan.size > 0) {
    resourcesToUpdate.push(carePlan);
  }
  const bundle = pushResourceBundle(resourcesToUpdate);
  const refetchedCarePlan = await fetchCarePlan(data.careplan.patientId);
  return refetchedCarePlan?.carePlanData;
};

export const fetchCarePlanVersion = async (
  id: string,
  version: number
): Promise<CarePlanData | null> => {
  try {
    const res = await fhirServer.get(`/CarePlan/${id}/_history/${version}`);
    return await createDetails(id, res.data);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const setCurrentVersion = async (
  id: string,
  version: number
): Promise<CarePlanData | null> => {
  try {
    const res = await fhirServer.get(`/CarePlan/${id}/_history/${version}`);
    await fhirServer.put(`/CarePlan/${id}`, res.data);
    return await createDetails(id, res.data);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const creatNewTask = (
  carePlan: CarePlanData,
  activity: CarePlanDataActivity
): fhirR4.Task => {
  const task = createGenericTask({
    taskReference: activity.taskReference!,
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
  taskReference,
}: {
  taskReference: string;
  patientId: string;
  taskDescription: string;
  questId: string;
  carePlan: CarePlanData;
  taskStatus: string;
}) => {
  const patientReference = new fhirR4.Reference();
  patientReference.reference = `Patient/${patientId}`;

  const questRef = new fhirR4.Reference();
  questRef.reference = `${questId}`;

  const period = new fhirR4.Period();
  period.start = new Date();
  period.end = new Date();

  const task = new fhirR4.Task();
  task.id = taskReference;
  task.resourceType = "Task";
  task.status =
    taskStatus !== "null" ? (taskStatus as any) : fhirR4.Task.StatusEnum.Ready;
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
  meta.tag = carePlan.tags.filter(
    (tag) =>
      tag.system !== "https://d-tree.org/fhir/created-on-tag" &&
      tag.system !== "https://d-tree.org/fhir/careplan-reference"
  );
  meta.tag.push({
    system: "https://d-tree.org/fhir/careplan-reference",
    code: "CarePlan/" + carePlan.id,
    display: carePlan.title,
  });
  meta.tag.push({
    system: "https://d-tree.org/fhir/created-on-tag",
    code: new Date().toLocaleDateString("en-GB"),
    display: "Created on",
  });
  meta.tag.push({
    system: "https://d-tree.org/fhir/procedure-code",
    code: questId,
  });
  task.meta = meta;
  return task;
};
