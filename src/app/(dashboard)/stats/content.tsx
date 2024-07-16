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
      {date && <h3>Results for: {date.split("T")[0]}</h3>}
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

export default Content;
