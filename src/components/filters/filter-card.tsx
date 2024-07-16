import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  console.log(type);

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
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select</SelectLabel>
                {prefileValue != undefined &&
                  prefileValue.map((value: any) => {
                    return (
                      <SelectItem key={value.id} value={value.id}>
                        {value.name}
                      </SelectItem>
                    );
                  })}
              </SelectGroup>
            </SelectContent>
          </Select>
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

export default FilterCard;
