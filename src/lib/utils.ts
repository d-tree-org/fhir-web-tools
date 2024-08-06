import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { addDays, subMinutes, startOfDay } from "date-fns";
import { fhirR4 } from "@smile-cdr/fhirts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function eachDayOfInterval({
  start,
  end = new Date(Date.now()),
}: {
  start: Date;
  end?: Date;
}) {
  const offset = {
    start: start.getTimezoneOffset(),
    end: end.getTimezoneOffset(),
  };

  // Adjust start and end dates for timezone offset to use start of UTC date
  const adjusted = {
    start: subMinutes(startOfDay(start.getTime()), offset.start),
    end: subMinutes(startOfDay(end.getTime()), offset.end),
  };

  let accumulator = adjusted.start;
  const days: Date[] = [];

  while (end >= accumulator) {
    days.push(accumulator);
    accumulator = addDays(accumulator, 1);
  }

  return days;
}

export const paramGenerator = (
  resources: string,
  params: Record<string, string | number | string>
) => {
  return `${resources}?${Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&")}`;
};

export const createJsonPatchUpdate = (data: any) => {
  const binary = new fhirR4.Binary();
  binary.contentType = "application/json-patch+json";
  binary.resourceType = "Binary";
  binary.data = Buffer.from(JSON.stringify(data)).toString("base64");
  return binary;
};

