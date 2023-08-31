export interface Filter {
  name: string;
  template: string;
  params: FilterParams[];
}

export interface FilterParams {
  name: string;
  value: any;
}

export const filters: Filter[] = [
  {
    name: "Search by name",
    template: "Patient?given={{name}}",
    params: [
      {
        name: "name",
        value: "John",
      },
    ],
  },
];
