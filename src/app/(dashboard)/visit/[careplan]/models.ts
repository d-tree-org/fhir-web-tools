export interface CarePlanListItem {
  id: string;
  title: string;
  status: string;
  intent: string;
  period?: Date | string;
  visit: string;
}

// draft | active | on-hold | revoked | completed | entered-in-error | unknown
export const carePlanStatus = [
  "draft",
  "active",
  "on-hold",
  "revoked",
  "completed",
  "entered-in-error",
  "unknown",
];

export type CarePlanStatus = (typeof carePlanStatus)[number];
