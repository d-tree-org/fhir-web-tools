import { fhirServer } from "@/lib/api/axios";
import { BundleEntry } from "@/model/resources";

export default async function Page({ params }: { params: { id: string } }) {
  const data = await fetchData(params.id);
  return (
    <div className="container">
      <div className="stats shadow">
        {data.map((location) => {
          return (
            <div key={location.id} className="stat">
              <p className="stat-title">{location.title}</p>
              <h2 className="stat-value text-primary">{location.count}</h2>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const fetchData: (id: string) => Promise<CountSummary[]> = async (id) => {
  try {
    const entries: BundleEntry[] = [];
    const titles = [
      "Exposed Infants",
      "Clients Already on ART",
      "Newly Diagnosed Client",
    ];
    entries.push(
      addFetch("/Patient", {
        _tag: [
          `http://smartregister.org/fhir/location-tag|${id}`,
          "https://d-tree.org/fhir/patient-meta-tag|exposed-infant",
        ],
        _summary: "count",
      })
    );

    entries.push(
      addFetch("/Patient", {
        _tag: [
          `http://smartregister.org/fhir/location-tag|${id}`,
          "https://d-tree.org/fhir/patient-meta-tag|client-already-on-art",
        ],
        _summary: "count",
      })
    );

    entries.push(
      addFetch("/Patient", {
        _tag: [
          `http://smartregister.org/fhir/location-tag|${id}`,
          "https://d-tree.org/fhir/patient-meta-tag|newly-diagnosed-client",
        ],
        _summary: "count",
      })
    );

    const { data } = await fhirServer.post(`/`, {
      resourceType: "Bundle",
      type: "transaction",
      entry: entries,
    });

    if (data == null) {
      return [];
    }

    return data.entry.map((entry: any, index: number) => {
      return {
        id: entry.resource.id,
        count: entry.resource.total,
        title: titles[index],
      };
    });
  } catch (error) {
    console.log(error);
  }
};

type CountSummary = {
  id: string;
  count: number;
  title: string;
};

const addFetch = (path: string, params: Record<string, any>): BundleEntry => {
  let query = "";
  for (const key in params) {
    const param = params[key];
    if (Array.isArray(param)) {
      for (const p of param) {
        query += `${key}=${p}&`;
      }
    } else {
      query += `${key}=${param}&`;
    }
  }
  const url = `${path}?${query}`;
  console.log(url);

  return { request: { method: "GET", url: url } };
};
