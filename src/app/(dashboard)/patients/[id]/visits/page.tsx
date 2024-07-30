import React from "react";
import { fetchData } from "./fetch";
import Link from "next/link";

type Props = {
  params: { id: string };
};

const Visits = async ({ params: { id } }: Props) => {
  const data = await fetchData(id);
  return (
    <div className="container">
      <div className="flex flex-col gap-4 w-full">
        {data?.map((item) => (
          <Link
            key={item.id}
            href={`/visit/${item.id}`}
            className="card card-compact bg-base-100 shadow-xl w-full"
          >
            <div className="card-body">
              <h2 className="card-title">{item.title}</h2>
              <div className="flex flex-row gap-2">
                <span className="badge">Visit {item.visit}</span>
                <span className="badge badge-primary">
                  Status {item.status}
                </span>
                <span className="badge">Intent {item.intent}</span>
              </div>
              <p>{item.period?.toString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Visits;
