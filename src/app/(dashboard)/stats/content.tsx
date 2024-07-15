"use client";

import { useGenericContext } from "@/components/filters/context";
import { SummaryItem } from "@/lib/models/types";
import React from "react";

type Props = {};

const Content = (props: Props) => {
  const { data } = useGenericContext();
  const summaries = data as SummaryItem[];
  return (
    <div>
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
