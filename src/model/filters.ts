export interface Filter {
  id: string;
  name: string;
  template: string;
  params: FilterParams[];
}

export enum FilterParamType {
  string = "string",
  date = "date",
  number = "number",
  boolean = "boolean",
  select = "select",
}

export interface FilterParams {
  name: string;
  type: FilterParamType;
  title: any;
}

export const patientFilters: Filter[] = [
  {
    id: "patient-search-by-name",
    name: "Search by name",
    template: "given={name}",
    params: [
      {
        name: "name",
        title: "Enter name",
        type: FilterParamType.string,
      },
    ],
  },
  {
    id: "patient-search-by-fullname",
    name: "Search by Fullname",
    template: "given={given}&family={family}",
    params: [
      {
        name: "given",
        title: "First name",
        type: FilterParamType.string,
      },
      {
        name: "family",
        title: "Last name",
        type: FilterParamType.string,
      },
    ],
  },
];

export const filters = {
  patient: patientFilters,
};

export interface FilterFormData {
  filters: FilterFormItem[];
}

export interface FilterFormItem {
  filterId: string;
  template: string;
  params: FilterFormParamData[];
}

export interface FilterFormParamData {
  name: string;
  type: FilterParamType;
  value?: string;
}
