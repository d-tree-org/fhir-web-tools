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
    <div>
      {date && <h3>Results for: {formatDate(date)}</h3>}
      {summaries.map((summary) => (
        <div key={summary.name} className="card w-full bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">
              <span>{summary.name}</span>
              <span className="badge">{summary.value}</span>
            </h2>
          </div>
        </div>
      ))}
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
