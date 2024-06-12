import { fhirServer } from "@/lib/api/axios";
import { CarePlanData, CarePlanDataActivity } from "./types";

export const fetchCarePlan = async (id: string) => {
  try {
    const res = await fhirServer.get("/CarePlan", {
      params: {
        subject: id,
        status: "active",
      },
    });

    const data = res.data.entry?.[0];
    if (data != undefined) {
      const resource = data.resource;
      console.log(resource);
      return createDetails(id, resource);
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const createDetails = async (
  patienyId: string,
  carePlan: any
): Promise<CarePlanData> => {
  const tasks = await getTasksFromCarePlan(carePlan);
  return {
    title: carePlan.title,
    patientId: patienyId,
    activities: tasks,
    requester: carePlan.author,
  };
};

const getTasksFromCarePlan = async (
  carePlan: any
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

const mapTaskToCarePlan = (task: string) => {
  switch (task) {
    case "failed":
      return "stopped";
    case "cancelled":
      return "cancelled";
    case "ready":
      return "not-started";
    case "completed":
    case "on-hold":
    case "in-progress":
    case "entered-in-error":
      return task;
    default:
      return "null";
  }
};
