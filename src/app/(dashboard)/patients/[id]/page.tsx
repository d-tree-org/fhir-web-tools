import { CarePlanContainer } from "./components/careplanContainer";
import { fixTasks } from "./actions";
import { fetchCarePlan } from "./fetch";
import { CarePlanData } from "../../../../lib/models/types";
import { fhirServer } from "@/lib/api/axios";
import { createPatient } from "@/lib/fhir/patient";
import { Patient } from "@/lib/fhir/types";
import { patientFilters } from "@/model/filters";
import format from "string-template";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { fhirR4 } from "@smile-cdr/fhirts";
import Duplicates from "./components/duplicates";
import PatientInfo from "./components/patientInfo";

export const maxDuration = 60;

type TabItem = {
  id: string;
  title: string;
  count?: number;
  show: boolean;
};

export default async function Page({ params }: { params: { id: string } }) {
  const {
    carePlanData: carePlan,
    patient,
    duplicates,
  } = await fetchData(params.id);

  const tabs: TabItem[] = [
    { title: "Care Plan", id: "general", show: true },
    {
      title: `Possible duplicates`,
      id: "duplicates",
      show: duplicates.length > 0,
      count: duplicates.length,
    },
  ];

  return (
    <div className="container">
      <div className="flex flex-col gap-4">
        <div className="">{patient && <PatientInfo patient={patient} />}</div>
        <TabGroup>
          <TabList className="flex gap-4 tabs tabs-boxed">
            {tabs
              .filter((e) => e.show)
              .map((tab) => (
                <Tab key={tab.id} className="tab data-[selected]:tab-active">
                  {tab.title}
                  {tab.count && <span className="badge">{tab.count}</span>}
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
                <Duplicates duplicates={duplicates} />
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
  return { patient, duplicates: duplicates?.filter((e) => e.id !== patient.id) ?? [] };
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
