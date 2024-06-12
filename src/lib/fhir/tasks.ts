export const mapCarePlanToTask = (carePlanStatus: string) => {
  switch (carePlanStatus) {
    case "stopped":
      return "failed";
    case "cancelled":
      return "cancelled";
    case "not-started":
      return "ready";
    case "completed":
    case "on-hold":
    case "in-progress":
    case "entered-in-error":
      return carePlanStatus;
    default:
      return "null";
  }
};

export const mapTaskToCarePlan = (task: string) => {
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
