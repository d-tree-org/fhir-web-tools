"use client";

import { useGenericContext } from "@/components/filters/context";
import { SummaryResponse } from "@/lib/models/types";
import React from "react";
import { format } from "date-fns";

type Props = {};

const Content = (props: Props) => {
  const { data } = useGenericContext();
  const { summaries, date } = data as SummaryResponse;

  return (
    <div className="my-8 flex flex-col gap-4">
      {date && <h3>Results for: {formatDate(date)}</h3>}
      <div className="stats shadow">
        {summaries.map((summary) => (
          <div key={summary.name} className="stat">
            <div className="stat-title">{summary.name}</div>
            <div className="stat-value">{summary.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const formatDate = (date: string | string[]) => {
  if (typeof date === "string") {
    return date.split("T")[0];
  } else {
    return date.map((d) => format(d, "dd/MM/yyyy")).join(", ");
  }
};

export default Content;
