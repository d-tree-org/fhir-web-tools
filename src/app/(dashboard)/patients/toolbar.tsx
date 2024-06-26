"use client";

import React from "react";
import { DataFacetedFilter } from "./input-filter";
import { FilterFormData, patientFilters } from "@/model/filters";
import { Separator } from "@/components/ui/separator";
import FilterCard from "./filter-card";
import { useForm, FormProvider, Control, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Patient } from "../../../lib/fhir/types";
import Link from "next/link";

type Props = {
  action: (data: FormData) => Promise<any>;
};

const Toolbar = ({ action }: Props) => {
  const methods = useForm<FilterFormData>({
    defaultValues: {
      filters: [],
    },
  });
  console.log(methods.formState.isDirty);
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data: FilterFormData) => {
    setLoading(true);
    const form = new FormData();
    form.append("data", JSON.stringify(data));
    const responses = await action(form);
    setPatients(responses);
    setLoading(false);
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <FormContainer control={methods.control} />
        </form>
      </FormProvider>
      <div className="flex flex-col gap-2 my-2">
        {loading && (
          <div className="flex flex-col gap-4 w-full p-8">
            <p>Fetching...</p>
            <progress className="progress w-full"></progress>
          </div>
        )}
        {patients.map((patient) => (
          <div key={patient.name} className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">
                <span>{patient.name}</span>
                <Link href={`/patients/${patient.id}`}>
                  <a className="btn btn-primary">View</a>{" "}
                </Link>
              </h2>
              <div className="flex flex-col gap-2">
                <span className="badge">
                  ART/HCC Number: {patient.identifier}
                </span>
                <span className="badge">Gender: {patient.gender}</span>
                <span className="badge">BirthDate: {patient.birthDate}</span>
                {patient.phoneNumbers.map((value, index) => (
                  <div key={value.number} className="flex flex-row gap-2">
                    <span className="badge">
                      Phone {index + 1}: {value.number}
                    </span>
                    <span className="badge">Owner: {value.owner}</span>
                  </div>
                ))}
                <span className="badge">Active: {patient.active}</span>
                {patient.address.map((address, index) => (
                  <div key={address.facility} className="flex flex-row gap-2">
                    <span className="badge">Facility: {address.facility}</span>
                    <span className="badge">Physical: {address.physical}</span>
                  </div>
                ))}
                <span className="badge">
                  Registration Date: {patient.registrationDate}
                </span>
                <span className="badge">
                  Registered By: {patient.registratedBy}
                </span>
              </div>
            </div>
          </div>
        ))}
        {!loading && patients.length == 0 && (
          <div className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">No Patients Found</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FormContainer = ({
  control,
}: {
  control: Control<FilterFormData, any>;
}) => {
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "filters",
    }
  );
  return (
    <div className="flex flex-col gap-4">
      <DataFacetedFilter
        filters={patientFilters}
        selectedFilters={fields}
        add={(filter) => append(filter)}
        deleteFilter={(filter) =>
          remove(fields.findIndex((f) => f.filterId == filter.filterId))
        }
        clear={() => {
          remove();
        }}
      />
      <Separator />
      {fields.map((filter, index) => {
        const data = patientFilters.find((f) => f.id == filter.filterId);

        return <FilterCard key={filter.id} filter={data!} arrayIndex={index} />;
      })}
      <Button>Search</Button>
    </div>
  );
};

export default Toolbar;
