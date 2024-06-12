import { CarePlanContainer } from "./careplanContainer";
import { fixTasks } from "./actions";
import { fetchCarePlan } from "./fetch";
import { CarePlanData } from "./types";
import { fhirServer } from "@/lib/api/axios";
import { createPatient } from "@/lib/fhir/patient";
import { Patient } from "@/lib/fhir/types";
import { patientFilters } from "@/model/filters";
import format from "string-template";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Link from "next/link";
import { fhirR4 } from "@smile-cdr/fhirts";


export const maxDuration = 60;

export default async function Page({ params }: { params: { id: string } }) {
  const {
    carePlanData: carePlan,
    patient,
    duplicates,
  } = await fetchData(params.id);
  const tabs = [{ title: "Care Plan", id: "general" }];
  if (duplicates.length > 0) {
    tabs.push({
      title: `Possible duplicates (${duplicates.length + 1})`,
      id: "duplicates",
    });
  }
  return (
    <div className="container">
      <div className="flex flex-col gap-4">
        <div className="">
          {patient && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-row flex-wrap gap-2 justify-between">
                <h1 className="text-2xl font-bold">{patient.name}</h1>
                <div></div>
              </div>
              <p className="text-sm text-gray-500">{patient.id}</p>
            </div>
          )}
        </div>
        <TabGroup>
          <TabList className="flex gap-4 tabs tabs-boxed">
            {tabs.map((tab) => (
              <Tab key={tab.id} className="tab data-[selected]:tab-active">
                {tab.title}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="mt-3">
            <TabPanel key="general" className="rounded-xl bg-white/5 p-3">
              {carePlan && (
                <CarePlanContainer data={carePlan} action={fixTasks} />
              )}
              {!carePlan && (
                <div className="flex flex-col gap-4 w-full p-8">
                  <h1>No care plan found</h1>
                </div>
              )}
            </TabPanel>
            {duplicates.length > 0 && (
              <TabPanel key="duplicates" className="rounded-xl p-3">
                <div className="flex flex-col gap-4 w-full p-8">
                  <div className="flex flex-col gap-4 ">
                    {duplicates.map((patient) => (
                      <div key={patient.id} className="card  bg-base-200">
                        <div className="card-body flex flex-col gap-2">
                          <div className="flex flex-row gap-2">
                            <h1>{patient.name}</h1>
                            <p>{patient.id}</p>
                            <Link
                              href={`/patients/${patient.id}`}
                              className="btn btn-secondary"
                            >
                              View
                            </Link>
                          </div>
                          <div className="flex flex-row gap-2">
                            <p>{patient.identifier}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabPanel>
            )}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}

const fetchData = async (
  id: string
): Promise<{
  carePlanData?: CarePlanData | null;
  carePlan?: fhirR4.CarePlan | null;
  patient?: Patient | null;
  duplicates: Patient[];
}> => {
  const data = await fetchCarePlan(id);
  const res = await fetchUserData(id);
  return {
    carePlanData: data?.carePlanData,
    patient: res.patient,
    duplicates: res.duplicates,
  };
};

const fetchUserData = async (id: string) => {
  const res = await fhirServer.get("/Patient/" + id);
  const data = res.data;
  const patient = createPatient(data);
  const duplicates = await fetchPosibleDuplicates({
    firstName: patient.firstName,
    lastName: patient.lastName,
    identifier: patient.identifier,
  });
  return { patient, duplicates: duplicates.filter((e) => e.id !== patient.id) };
};

const fetchPosibleDuplicates = async ({
  firstName,
  lastName,
  identifier,
}: {
  firstName: string;
  lastName: string;
  identifier: string;
}): Promise<Patient[]> => {
  const idFilter = patientFilters.find(
    (filter) => filter.id === "patient-search-by-identifier"
  );
  const nameFilter = patientFilters.find(
    (filter) => filter.id === "patient-search-by-fullname"
  );
  const queries: string[] = [];
  const identifierQuery = format(idFilter?.template ?? "", { identifier });
  const nameQuery = format(nameFilter?.template ?? "", {
    given: firstName,
    family: lastName,
  });
  queries.push(identifierQuery);
  queries.push(nameQuery);
  console.log(queries);

  const res = await fhirServer.get("/Patient?" + queries.join("&"), {});
  return res.data.entry?.map((entry: any) => createPatient(entry.resource));
};
