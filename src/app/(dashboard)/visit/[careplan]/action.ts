"use server";

import { fhirServer } from "@/lib/api/axios";
import { CarePlanListItem, CarePlanStatus } from "./models";

export const fetchData = async (
  id: string
): Promise<CarePlanListItem | null> => {
  try {
    const resource = (await fhirServer.get(`/CarePlan/${id}`)).data;
    return {
      id: resource.id ?? "",
      title: resource.title ?? "NA",
      status: resource.status ?? "NA",
      intent: resource.intent ?? "NA",
      period: resource.period?.start,
      visit:
        resource.category?.find(
          (e: any) =>
            e?.coding?.[0].system ==
            "https://d-tree.org/fhir/care-plan-visit-number"
        )?.coding?.[0].code ?? "NA",
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const onCarePlanStatusChange = async (
  id: string,
  status: CarePlanStatus
) => {
  try {
    const resource = (await fhirServer.get(`/CarePlan/${id}`)).data;
    await fhirServer.put(`/CarePlan/${id}`, {
      ...resource,
      status: status,
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};
