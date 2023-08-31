import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Filter, FilterFormData, FilterParamType } from "@/model/filters";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";

const GetInput = ({ type, name }: { type: FilterParamType; name: string }) => {
  const { control } = useFormContext();
  if (type == FilterParamType.string) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => <Input {...field} />}
      />
    );
  }

  return <div>Input</div>;
};

const FilterCard = ({
  filter,
  arrayIndex,
}: {
  filter: Filter;
  arrayIndex: number;
}) => {
  const { control } = useFormContext<FilterFormData>();
  const { fields } = useFieldArray(
    {
      control,
      name: `filters.${arrayIndex}.params`,
    }
  );

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
