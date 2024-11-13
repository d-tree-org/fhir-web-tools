import { Button } from "@/components/ui/button";
import { fhirHelperServer } from "@/lib/api/axios";
import { FacilityTracingData, SummaryItem } from "@/lib/models/helpers";
import Link from "next/link";
import { FacilityParam } from "../model";

export default async function Page({ params }: FacilityParam) {
  const { id } = await params;
  const data = await fetchData(id);
  const stats: SummaryItem[] = [
    {
      name: "Total",
      value: data.total,
    },
    {
      name: "Home",
      value: data.homeTotal,
    },
    {
      name: "Phone",
      value: data.phoneTotal,
    },
  ];
  return (
    <div className="container">
      <div className="prose prose-sm md:prose-base w-full max-w-4xl flex-grow pt-10">
        <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <div className="ml-auto flex w-full">
            <Link href={"tracing/all"}>
              <Button variant="secondary">View tracing list</Button>
            </Link>
          </div>
        </div>

        <div>
          <div className="">
            <h1 className="stat-group-title">Tracing values</h1>
            <div className="stats shadow">
              <div className="stats stats-vertical md:stats-horizontal">
                {stats.map((summary) => {
                  return (
                    <div key={summary.name} className="stat">
                      <p className="stat-title">{summary.name}</p>
                      <div className="stat-value text-primary">
                        {summary.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const fetchData: (id: string) => Promise<FacilityTracingData> = async (id) => {
  try {
    const { data } = await fhirHelperServer.get<FacilityTracingData>(
      `/tracing/facility/${id}`
    );
    return data;
  } catch (error) {
    console.log(error);
    return {
      total: 0,
      homeTotal: 0,
      phoneTotal: 0,
    };
  }
};
