import { fhirServer } from "@/lib/api/axios";
import { Location } from "@/model/resources";

export default async function Page() {
  const data = await getData();
  return (
    <main className="container mt-6">
      <h1>Facilities</h1>
      <div className="p-2 flex flex-col gap-4">
        {data.map((location) => {
          return (
            <a key={location.id} href={`/facilities/${location.id}`}>
              <div className="p-4 bg-base-100 rounded-lg">
                <h2>{location.name}</h2>
              </div>
            </a>
          );
        })}
      </div>
    </main>
  );
}

const getData: () => Promise<Location[]> = async () => {
  try {
    const { data } = await fhirServer.get("/Location", {
      params: {
        _count: 100,
        type: "https://d-tree.org/fhir/location-type|facility",
      },
    });
    if (data == null) {
      return [];
    }

    return data.entry.map((entry: any) => {
      return {
        id: entry.resource.id,
        name: entry.resource.name,
      };
    });
  } catch (error) {
    console.log(error);
  }
};
