import HiddenText from "@/components/hidden.text";
import { Patient } from "@/lib/fhir/types";
import React from "react";

type Props = {
  patient: Patient;
};

const PatientInfo = ({ patient }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row flex-wrap gap-4 items-center">
        <h1 className="text-2xl font-bold">{patient.name}</h1>
        <div className="flex flex-row gap-2 items-center">
          <span>{patient.gender}</span>
          <span>{getAge(patient.birthDate)} years old</span>
        </div>
      </div>
      <div className="flex flex-row gap-2 flex-wrap mt-2">
        <span>{patient.id}</span>
        <HiddenText
          label="UUID"
          value={patient.id}
          className="text-sm text-gray-500"
        />
      </div>
    </div>
  );
};

function getAge(dateString: string) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var month = today.getMonth() - birthDate.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export default PatientInfo;
