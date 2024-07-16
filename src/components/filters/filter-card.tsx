import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IoIosCalendar as CalendarIcon } from "react-icons/io";
import { Calendar } from "@/components/ui/calendar";
import { Filter, FilterFormData, FilterParamType } from "@/model/filters";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { format, formatISO } from "date-fns";
import { DateRange } from "react-day-picker";

const GetInput = ({
  type,
  name,
  prefileValue,
}: {
  type: FilterParamType;
  name: string;
  prefileValue?: any;
}) => {
  const { control } = useFormContext();

  if (type === FilterParamType.string) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => <Input {...field} />}
      />
    );
  } else if (type === FilterParamType.select) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? prefileValue.find(
                          (value: any) => value.id === field.value
                        )?.name
                      : "Select"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search..." />
                  <CommandList>
                    <CommandEmpty>No value found.</CommandEmpty>
                    <CommandGroup>
                      {prefileValue.map((value: any) => (
                        <CommandItem
                          value={value.name}
                          key={value.id}
                          onSelect={() => {
                            field.onChange(value.id);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value.id === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {value.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  } else if (type === FilterParamType.date) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    if (date) {
                      field.onChange(formatISO(date));
                    } else {
                      field.onChange(null);
                    }
                  }}
                  // disabled={(date) =>
                  //   date > new Date() || date < new Date("1900-01-01")
                  // }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  } else if (type === FilterParamType.dateRange) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      formatRandge(field.value)
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={field.value}
                  onSelect={(date) => {
                    if (date) {
                      field.onChange({
                        from: date.from ? formatISO(date.from) : undefined,
                        to: date.to ? formatISO(date.to) : undefined,
                      });
                    } else {
                      field.onChange(null);
                    }
                  }}
                  // disabled={(date) =>
                  //   date > new Date() || date < new Date("1900-01-01")
                  // }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return <div>Input</div>;
};

const FilterCard = ({
  filter,
  arrayIndex,
  prefillData,
}: {
  filter: Filter;
  arrayIndex: number;
  prefillData?: any;
}) => {
  const { control } = useFormContext<FilterFormData>();
  const { fields } = useFieldArray({
    control,
    name: `filters.${arrayIndex}.params`,
  });

  return (
    <Card>
      <CardHeader>{filter.name}</CardHeader>
      <CardContent>
        {fields.map((raw, index) => {
          const param = filter.params.find((p) => p.name == raw.name)!;
          return (
            <div key={param.name}>
              <FormItem>
                <FormLabel>{param.title}</FormLabel>
                <FormControl>
                  <GetInput
                    type={param.type}
                    name={`filters.${arrayIndex}.params.${index}.value`}
                    prefileValue={
                      prefillData
                        ? prefillData[param.prefillKey ?? ""]
                        : undefined
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

const formatRandge = (value: DateRange | undefined) => {
  if (value) {
    return `${value.from ? format(value.from, "PPP") : "Pick a date"} - ${
      value.to ? format(value.to, "PPP") : "Pick a date"
    }`;
  }

  return "Pick a date";
};

const SiteSelect = () => {
  
}

export default FilterCard;
