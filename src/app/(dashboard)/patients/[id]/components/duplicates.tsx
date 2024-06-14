import { Patient } from "@/lib/fhir/types";
import Link from "next/link";
import React from "react";

type Props = {
  duplicates: Patient[];
};

const Duplicates = ({ duplicates }: Props) => {
  return (
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
  );
};

export default Duplicates;
