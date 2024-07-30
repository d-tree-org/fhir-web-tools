import { Patient } from "./types";

export const createPatient = (data: any): Patient => {
  return {
    id: data.id,
    locationId:
      data.meta.tag.find(
        (e: any) => e.system === "http://smartregister.org/fhir/location-tag"
      )?.code ?? "NA",
    identifier: data.identifier?.[0]?.value ?? "NA",
    name: data.name[0].given[0] + " " + data.name[0].family,
    firstName: data.name[0].given[0],
    lastName: data.name[0].family,
    gender: data.gender,
    birthDate: data.birthDate,
    phoneNumbers:
      data.telecom?.map((value: any) => {
        var array = value.value?.split("|");
        return {
          number: array[1],
          owner: array[2],
        };
      }) ?? [],
    active: data.active,
    address:
      data.address?.map((value: any) => ({
        facility: value.district ?? "NA",
        physical: data.address?.[0]?.text ?? "NA",
      })) ?? [],
    registrationDate:
      data.meta.tag.find(
        (e: any) => e.system === "https://d-tree.org/fhir/created-on-tag"
      )?.code ?? "NA",
    registratedBy: data.generalPractitioner?.[0]?.display ?? "NA",
  };
};
