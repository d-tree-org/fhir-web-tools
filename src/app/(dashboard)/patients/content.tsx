"use client";

import { useGenericContext } from "@/components/filters/context";
import { Patient } from "@/lib/fhir/types";
import Link from "next/link";
import React from "react";

type Props = {
  locationMap: Map<string, string>;
};

const Content = ({ locationMap }: Props) => {
  const { data } = useGenericContext();
  const patients = data as Patient[];
  return (
    <div className="flex flex-col gap-2">
      {patients.map((patient) => (
        <div key={patient.name} className="card w-full bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">
              <span>
                {patient.name} ({locationMap.get(patient.locationId) ?? "NA"})
              </span>
              <Link href={`/patients/${patient.id}`}>
                <a className="btn btn-primary">View</a>{" "}
              </Link>
            </h2>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 flex-wrap">
                <span className="badge">
                  ART/HCC Number: {patient.identifier}
                </span>
                <span className="badge">Active: {patient.active}</span>
                <span className="badge">Gender: {patient.gender}</span>
                <span className="badge">BirthDate: {patient.birthDate}</span>
              </div>
              {patient.phoneNumbers.map((value, index) => (
                <div key={value.number} className="flex flex-row flex-wrap gap-2">
                  <span className="badge">
                    Phone {index + 1}: {value.number} -- Owner: {value.owner}
                  </span>
                </div>
              ))}
              {patient.address.map((address, index) => (
                <div key={address.facility} className="flex flex-row flex-wrap gap-2">
                  <span className="badge">Location: {address.facility}</span>
                  <span className="badge">Physical: {address.physical}</span>
                </div>
              ))}
              <div className="flex flex-row gap-2 flex-wrap">
                <span className="badge">
                  Registration Date: {patient.registrationDate}
                </span>
                <span className="badge">
                  Registered By: {patient.registratedBy}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
      {patients.length == 0 && (
        <div className="card w-full bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">No Patients Found</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;
