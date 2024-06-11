import { fhirServer } from "@/lib/api/axios";

export default async function Page({ params }: { params: { id: string } }) {
  const data = await fetchCarePlan(params.id);
  return (
    <div className="container">
      <div className="p-2 ">
        <button className="btn btn-primary">Verify and fix careplan</button>
      </div>
      <div className="flex flex-col gap-4">
        {data && <CarePlanContainer data={data} />}
      </div>
    </div>
  );
}

const CarePlanContainer = ({ data }: { data: CarePlanData }) => {
  return (
    <>
      <h6>Tasks</h6>
      {data.activities?.map((activity: CarePlanDataActivity) => {
        return (
          <details key={activity.task} className="collapse bg-base-200">
            <summary className="collapse-title text-xl font-medium">
              <p>{activity.task}</p>
              <div className="flex flex-row gap-2">
                {activity.taskExists == false && (
                  <div className="badge badge-error gap-2">Task Missing</div>
                )}
                {activity.isTaskAndCarePlanSameStatus == false && (
                  <div className="badge badge-error gap-2">
                    Status different
                  </div>
                )}
              </div>
            </summary>
            <div className="collapse-content">
              <div className="flex flex-col p-2">
                <div className="flex flex-row gap-2">
                  <span className="badge badge-secondary">
                    CarePlan Status: {activity.carePlanActivityStatus}
                  </span>
                  <span className="badge badge-secondary">
                    Task Status: {activity.taskStatus}
                  </span>
                </div>
              </div>
            </div>
          </details>
        );
      })}
    </>
  );
};

type CarePlanData = {
  title: string;
  activities: CarePlanDataActivity[];
};

type CarePlanDataActivity = {
  task: string;
  taskReference?: string;
  carePlanActivityStatus: string;
  taskStatus: string;
  isTaskAndCarePlanSameStatus: boolean;
  taskExists: boolean;
  taskType: "normal" | "scheduled";
};

const fetchCarePlan = async (id: string) => {
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
      return createDetails(resource);
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const createDetails = async (carePlan: any): Promise<CarePlanData> => {
  const tasks = await getTasksFromCarePlan(carePlan);
  return {
    title: carePlan.title,
    activities: tasks,
  };
};

const getTasksFromCarePlan = async (
  carePlan: any
): Promise<CarePlanDataActivity[]> => {
  const taskIds: CarePlanDataActivity[] = carePlan.activity.map(
    (activity: any) => {
      const reference = activity.outcomeReference?.[0]?.reference;
      if (reference == undefined || reference == null) {
        return {
          task: activity.detail.description,
          carePlanActivityStatus: activity.detail.status,
          taskStatus: "unknown",
          isTaskAndCarePlanSameStatus: false,
          taskExists: false,
          taskType: "scheduled",
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
