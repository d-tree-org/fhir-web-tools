import { fhirServer } from "@/lib/api/axios";
import {
  CarePlanData,
  CarePlanDataActivity,
} from "../../../../lib/models/types";
import { fhirR4 } from "@smile-cdr/fhirts";
import { mapTaskToCarePlan } from "@/lib/fhir/tasks";

export const fetchCarePlan = async (
  id: string
): Promise<{
  carePlanData: CarePlanData;
  carePlan: fhirR4.CarePlan;
} | null> => {
  try {
    const res = await fhirServer.get("/CarePlan", {
      params: {
        subject: id,
        status: "active",
        _sort: "-_lastUpdated",
      },
    });

    const data = res.data.entry?.[0];
    if (data != undefined) {
      const resource = data.resource;
      return {
        carePlanData: await createDetails(id, resource),
        carePlan: resource,
      };
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createDetails = async (
  patienyId: string,
  carePlan: fhirR4.CarePlan
): Promise<CarePlanData> => {
  const tasks = await getTasksFromCarePlan(carePlan);
  const plan: CarePlanData = {
    id: carePlan.id ?? "",
    version: Number.parseInt(carePlan.meta?.versionId ?? "1"),
    author: carePlan.author?.display,
    tags: carePlan?.meta?.tag ?? [],
    title: carePlan.title,
    patientId: patienyId,
    activities: tasks,
    requester: carePlan.author?.display,
    period: {
      start: carePlan.period?.start?.toString() ?? "NA",
      end: carePlan.period?.end?.toString() ?? "NA",
    },
    visitNumber:
      carePlan.category?.find(
        (e) =>
          e?.coding?.[0].system ==
          "https://d-tree.org/fhir/care-plan-visit-number"
      )?.coding?.[0].code ?? "NA",
  };
  return plan;
};

const getTasksFromCarePlan = async (
  carePlan: fhirR4.CarePlan
): Promise<CarePlanDataActivity[]> => {
  const taskIds: CarePlanDataActivity[] = (carePlan.activity as any[]).map(
    (activity: any): CarePlanDataActivity => {
      const reference = activity.outcomeReference?.[0]?.reference;
      if (reference == undefined || reference == null) {
        return {
          task: activity.detail.description,
          carePlanActivityStatus: activity.detail.status,
          taskStatus: "unknown",
          isTaskAndCarePlanSameStatus: false,
          taskExists: false,
          taskType: "scheduled",
          questionnaire: activity.detail.code.coding[0].code,
        };
      }
      const taskId = reference.split("/").pop();
      if (!taskId) {
        throw new Error(
          `Invalid reference format in activity detail: ${reference}`
        );
      }

      return {
        task: activity.detail.description,
        taskReference: taskId,
        carePlanActivityStatus: activity.detail.status,
        taskStatus: "unknown",
        isTaskAndCarePlanSameStatus: false,
        taskExists: false,
        questionnaire: activity.detail.code.coding[0].code,
        taskType: "normal",
      };
    }
  );
  const tasksPromises = taskIds.map(async (task: CarePlanDataActivity) => {
    if (task.taskReference == undefined || task.taskReference == null) {
      return task;
    }
    const result = await fetchTask(task.taskReference);
    if (!result) {
      return {
        ...task,
        taskExists: false,
      };
    }
    return {
      ...task,
      taskStatus: mapTaskToCarePlan(result.status),
      isTaskAndCarePlanSameStatus: areStatusTheSame(
        task.carePlanActivityStatus,
        result.status
      ),
      taskExists: true,
    };
  });
  const tasks = await Promise.all(tasksPromises);

  return tasks;
};

async function fetchTask(taskId: string): Promise<any> {
  try {
    const response = await fhirServer.get(`Task/${taskId}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

const areStatusTheSame = (carePlanStatus: string, taskStatus: string) => {
  return carePlanStatus === mapTaskToCarePlan(taskStatus);
};
