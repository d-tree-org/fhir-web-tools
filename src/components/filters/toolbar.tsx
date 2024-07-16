"use client";

import React from "react";
import { DataFacetedFilter } from "./input-filter";
import { Filter, FilterFormData, patientFilters } from "@/model/filters";
import { Separator } from "@/components/ui/separator";
import FilterCard from "./filter-card";
import { useForm, FormProvider, Control, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { GenericContextProvider, useGenericContext } from "./context";

type Props<T> = {
  action: (data: FormData) => Promise<any>;
  defaultItem: T;
  filters: Filter[];
  prefillData?: any;
  children?: React.ReactElement;
};

const FilterToolbar = <T extends unknown>(props: Props<T>) => {
  return (
    <GenericContextProvider initialData={props.defaultItem}>
      <FilterToolbarContainer {...props} />
    </GenericContextProvider>
  );
};

const FilterToolbarContainer = <T extends unknown>({
  action,
  filters,
  children,
  prefillData,
}: Props<T>) => {
  const methods = useForm<FilterFormData>({
    defaultValues: {
      filters: [],
    },
  });
  console.log(methods.formState.isDirty);
  const { setData } = useGenericContext();
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data: FilterFormData) => {
    setLoading(true);
    const form = new FormData();
    form.append("data", JSON.stringify(data));
    const responses = await action(form);
    setData(responses);
    setLoading(false);
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <FormContainer
            control={methods.control}
            filters={filters}
            prefillData={prefillData}
          />
        </form>
      </FormProvider>
      <div className="flex flex-col gap-2 my-2">
        {loading && (
          <div className="flex flex-col gap-4 w-full p-8">
            <p>Fetching...</p>
            <progress className="progress w-full"></progress>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

const FormContainer = ({
  control,
  filters,
  prefillData,
}: {
  control: Control<FilterFormData, any>;
  filters: Filter[];
  prefillData?: any;
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
        filters={filters}
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
        const data = filters.find((f) => f.id == filter.filterId);
        console.log(JSON.stringify(filter));

        return (
          <FilterCard
            key={filter.id}
            filter={data!}
            arrayIndex={index}
            prefillData={prefillData}
          />
        );
      })}
      <Button>Search</Button>
    </div>
  );
};

export default FilterToolbar;
