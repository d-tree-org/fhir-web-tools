export interface Filter {
  id: string;
  name: string;
  template: string;
  isObject?: boolean;
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
  prefillKey?: string;
}

export const patientFilters: Filter[] = [
  {
    id: "patient-search-by-first-name",
    name: "Search by Firstname",
    template: "given={name}",
    params: [
      {
        name: "name",
        title: "Enter Firstname",
        type: FilterParamType.string,
      },
    ],
  },
  {
    id: "patient-search-by-last-name",
    name: "Search by Lastname",
    template: "family={name}",
    params: [
      {
        name: "name",
        title: "Enter Lastname",
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
  {
    id: "patient-search-by-identifier",
    name: "Search by ART/HCC #",
    template: "identifier={identifier}",
    params: [
      {
        name: "identifier",
        title: "Enter ART/HCC Number",
        type: FilterParamType.string,
      },
    ],
  },
];

export const statsFilters: Filter[] = [
  {
    id: "filter-by-location",
    name: "Search by Location",
    template: "_tag_location",
    isObject: true,
    params: [
      {
        name: "location",
        title: "Enter facility",
        type: FilterParamType.select,
        prefillKey: "locations",
      },
    ],
  },
  {
    id: "filter-by-date",
    name: "Search by Date",
    template: "date",
    isObject: true,
    params: [
      {
        name: "date",
        title: "Enter date",
        type: FilterParamType.date,
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
