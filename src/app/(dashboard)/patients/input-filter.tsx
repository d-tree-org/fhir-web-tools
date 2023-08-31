import * as React from "react";
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, FilterFormItem } from "@/model/filters";

interface DataTableFacetedFilter<TData, TValue> {
  filters: Filter[];
  selectedFilters: FilterFormItem[];
  title?: string;
  add: (filters: FilterFormItem) => void;
  deleteFilter: (filters: FilterFormItem) => void;
  clear: () => void;
}

export function DataFacetedFilter<TData, TValue>({
  filters,
  selectedFilters,
  title,
  add,
  deleteFilter,
  clear,
}: DataTableFacetedFilter<TData, TValue>) {
  const selectedValues = new Set(selectedFilters.map((f) => f.filterId));
  // TODO: fix addition of extra values to the filter
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          {title}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {filters.map((option) => {
                const isSelected = selectedValues.has(option.id);
                return (
                  <CommandItem
                    key={option.id}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.id);
                        deleteFilter({ ...option, filterId: option.id });
                      } else {
                        selectedValues.add(option.id);
                        add({ ...option, filterId: option.id });
                      }
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    <span>{option.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={clear}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
