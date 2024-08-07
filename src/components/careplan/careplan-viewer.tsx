"use client";

import { CarePlanData } from "@/lib/models/types";
import React from "react";
import { CarePlanContainer } from "./careplanContainer";

type Props = {
  data: CarePlanData;
  fixCarePlan: (data: FormData) => Promise<any>;
  toVersion: (id: string, version: number) => Promise<CarePlanData | null>;
  setCurrentVersion: (
    id: string,
    version: number
  ) => Promise<CarePlanData | null>;
};

const CareplanViewer = ({
  toVersion,
  setCurrentVersion,
  data,
  fixCarePlan,
}: Props) => {
  const [carePlan, setCarePlan] = React.useState(data);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const changeVersion = async (
    action: () => Promise<CarePlanData | null>,
    reload: boolean = false
  ) => {
    try {
      setError(false);
      setLoading(true);
      const newCarePlan = await action();
      if (newCarePlan == null) {
        throw new Error("Could not fetch care plan");
      }
      setCarePlan(newCarePlan);
      setLoading(false);
      setError(false);
      if (reload) {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <CarePlanContainer
      data={carePlan}
      action={fixCarePlan}
      latestVersion={data.version}
      toVersion={(version) => {
        changeVersion(async () => {
          return await toVersion(data.id, version);
        });
      }}
      setCurrentVersion={(version) => {
        changeVersion(async () => {
          return await setCurrentVersion(data.id, version);
        }, true);
      }}
    />
  );
};

export default CareplanViewer;
