import { fhirHelperServer } from "@/lib/api/axios";
import { FacilityResultData } from "@/lib/models/helpers";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await fetchData(id);
  return (
    <div className="container">
      <div className="prose prose-sm md:prose-base w-full max-w-4xl flex-grow pt-10">
        <div className="flex flex-row flex-wrap gap-4">
          {data.groups.map((group) => {
            return (
              <div key={group.groupKey} className="">
                <h1 className="stat-group-title">{group.groupTitle}</h1>
                <div className="stats shadow">
                  <div className="stats stats-vertical md:stats-horizontal">
                    {group.summaries.map((summary) => {
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
            );
          })}
        </div>
      </div>
    </div>
  );
}

const fetchData: (id: string) => Promise<FacilityResultData> = async (id) => {
  try {
    const { data } = await fhirHelperServer.get<FacilityResultData>(
      `/stats/facility/${id}`
    );
    return data;
  } catch (error) {
    console.log(error);
    return { groups: [], date: "", generatedDate: "" };
  }
};
