import { fhirServer } from "@/lib/api/axios";
import { fhirR4 } from "@smile-cdr/fhirts";

interface CarePlanListItem {
  id: string;
  title: string;
  status: string;
  intent: string;
  period?: Date | string;
  visit: string;
}

export const fetchData = async (id: string): Promise<CarePlanListItem[] | null> => {
  try {
    const res = await fhirServer.get("/CarePlan", {
      params: {
        subject: id,
        _sort: "-date",
      },
    });

    const carePlans: CarePlanListItem[] = res.data.entry.map((entry: any) => {
      const resource = entry.resource as fhirR4.CarePlan;
      const data: CarePlanListItem = {
        id: resource.id ?? "",
        title: resource.title ?? "NA",
        status: resource.status ?? "NA",
        intent: resource.intent ?? "NA",
        period: resource.period?.start,
        visit:
          resource.category?.find(
            (e) =>
              e?.coding?.[0].system ==
              "https://d-tree.org/fhir/care-plan-visit-number"
          )?.coding?.[0].code ?? "NA",
      };
      return data;
    });

    return carePlans;
  } catch (error) {
    console.error(error);
    return null;
  }
};
