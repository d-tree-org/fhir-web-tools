import { fhirR4 } from "@smile-cdr/fhirts";
import { Patient } from "./types";

export const createPatient = (data: fhirR4.Patient): Patient => {
  const firstName = data.name?.[0]?.given?.[0] ?? "";
  const lastName = data?.name?.[0]?.family ?? "";
  return {
    id: data.id ?? "NA",
    locationId:
      (data.meta?.tag ?? []).find(
        (e: any) => e.system === "http://smartregister.org/fhir/location-tag"
      )?.code ?? "NA",
    identifier: data.identifier?.[0]?.value ?? "NA",
    name: `${firstName} ${lastName}`,
    firstName: firstName,
    lastName: lastName,
    gender: data.gender ?? "unknown",
    birthDate: data.birthDate ?? "",
    links:
      (data.link ?? []).map((value) => {
        const items = value.other.display?.split(",") ?? [];
        const name = items[items.length > 3 ? 2 : 1] ?? "NA";
        const initials = name
          .split(" ")
          .map((e) => e[0])
          .join("");
        return {
          id: items?.[0].trim() ?? "NA",
          name: name,
          initials: initials,
        };
      }) ?? [],
    phoneNumbers:
      data.telecom?.map((value: any) => {
        var array = value.value?.split("|");
        return {
          number: array[1],
          owner: array[2],
        };
      }) ?? [],
    active: data.active ?? true,
    address:
      data.address?.map((value: any) => ({
        facility: value.district ?? "NA",
        physical: data.address?.[0]?.text ?? "NA",
      })) ?? [],
    registrationDate:
      (data?.meta?.tag ?? []).find(
        (e: any) => e.system === "https://d-tree.org/fhir/created-on-tag"
      )?.code ?? "NA",
    registratedBy: data.generalPractitioner?.[0]?.display ?? "NA",
  };
};
