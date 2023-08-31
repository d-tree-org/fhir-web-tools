"use client";

import React, { useState } from "react";
import { DataFacetedFilter } from "./input-filter";
import { Filter, FilterFormData, patientFilters } from "@/model/filters";
import { Separator } from "@/components/ui/separator";
import FilterCard from "./filter-card";
import { useForm, FormProvider, Control, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";

type Props = {};

const Toolbar = (props: Props) => {
  const methods = useForm<FilterFormData>({
    defaultValues: {
      filters: [],
    },
  });
  const onSubmit = (data: any) => console.log(data);
  console.log(methods.formState.isDirty);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormContainer control={methods.control} />
      </form>
    </FormProvider>
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
