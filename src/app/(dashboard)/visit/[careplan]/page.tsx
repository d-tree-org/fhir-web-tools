import React from "react";
import { fetchData, onCarePlanStatusChange } from "./action";
import Components from "./component";

type Props = {
  params: { careplan: string };
};

const Page = async ({ params: { careplan } }: Props) => {
  const data = await fetchData(careplan);
  return (
    <div className="container">
      <div>
        <h2>{data?.title}</h2>
        <div>
          <span>Visit {data?.visit}</span>
          <span>Status {data?.status}</span>
          <span>Intent {data?.intent}</span>
        </div>
        <p>{data?.period?.toString()}</p>
      </div>
      <div>
        <Components
          id={careplan}
          data={data}
          onCarePlanStatusChange={onCarePlanStatusChange}
        />
      </div>
    </div>
  );
};

export default Page;
