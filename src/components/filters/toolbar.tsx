"use client";

import React from "react";
import { DataFacetedFilter } from "./input-filter";
import { Filter, FilterFormData, patientFilters } from "@/model/filters";
import { Separator } from "@/components/ui/separator";
import FilterCard from "./filter-card";
import {
  useForm,
  FormProvider,
  Control,
  useFieldArray,
  UseFormReturn,
} from "react-hook-form";
import { GenericContextProvider, useGenericContext } from "./context";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  Bird,
  Book,
  Bot,
  Code2,
  CornerDownLeft,
  LifeBuoy,
  Mic,
  Paperclip,
  Rabbit,
  Settings,
  Settings2,
  Share,
  Square as SquareTerminal,
  User as SquareUser,
  Triangle,
  Turtle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

type Props<T> = {
  action: (data: FormData) => Promise<any>;
  defaultItem: T;
  filters: Filter[];
  prefillData?: any;
  children?: React.ReactElement;
};

type FilterToolbarContainerProps<T> = {
  methods: UseFormReturn<FilterFormData, any, undefined>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  filters: Filter[];
  prefillData?: any;
  onSubmit: (data: FilterFormData) => void;
};

const FilterToolbar = <T extends unknown>(props: Props<T>) => {
  return (
    <GenericContextProvider initialData={props.defaultItem}>
      <FilterToolbarWRapper {...props} />
    </GenericContextProvider>
  );
};
const FilterToolbarWRapper = <T extends unknown>({
  children,
  ...props
}: Props<T>) => {
  const methods = useForm<FilterFormData>({
    defaultValues: {
      filters: [],
    },
  });
  console.log(methods.formState.isDirty);
  const { setData } = useGenericContext();
  const [loading, setLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(true);

  const onSubmit = async (data: FilterFormData) => {
    setLoading(true);
    const form = new FormData();
    form.append("data", JSON.stringify(data));
    const responses = await props.action(form);
    setData(responses);
    setIsOpen(false);
    setLoading(false);
  };
  return (
    <div className="grid h-screen w-full md:pl-[20%]">
      <aside className="inset-y fixed  left-0 z-20 hidden md:flex h-full w-1/5 flex-col border-r">
        <div className="border-b p-2">
          <Button variant="outline" size="icon" aria-label="Home">
            <Triangle className="size-5 fill-foreground" />
          </Button>
        </div>
        <nav className="grid gap-1 p-2">
          <div className="grid w-full items-start gap-6">
            <FormProvider {...methods}>
              <FilterToolbarContainer
                methods={methods}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                filters={props.filters}
                prefillData={props.prefillData}
                onSubmit={onSubmit}
              />{" "}
            </FormProvider>
          </div>
        </nav>
      </aside>
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4">
          <h1 className="text-xl font-semibold">Playground</h1>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Settings className="size-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80vh]">
              <DrawerHeader>
                <DrawerTitle>Configuration</DrawerTitle>
                <DrawerDescription>
                  Configure the settings for the model and messages.
                </DrawerDescription>
              </DrawerHeader>
              <div className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
                <FormProvider {...methods}>
                  <FilterToolbarContainer
                    methods={methods}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    filters={props.filters}
                    prefillData={props.prefillData}
                    onSubmit={onSubmit}
                  />
                </FormProvider>
              </div>
            </DrawerContent>
          </Drawer>
        </header>
        <main className="container">
          <div className="relative flex h-full w-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const FilterToolbarContainer = <T extends unknown>({
  methods,
  isOpen,
  setIsOpen,
  filters,
  prefillData,
  onSubmit,
}: FilterToolbarContainerProps<T>) => {
  return (
    <div
      className={cn(
        "w-full space-y-2 collapse",
        isOpen ? "collapse-open" : "collapse-close"
      )}
    >
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">Search filters</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <CaretSortIcon className="h-4 w-4" />
          <span className="sr-only">Toggle</span>
        </Button>
      </div>
      <div className="collapse-content">
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <FormContainer
            control={methods.control}
            filters={filters}
            prefillData={prefillData}
          />
        </form>
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
        console.log(JSON.stringify(filter), JSON.stringify(data ?? {}));

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
