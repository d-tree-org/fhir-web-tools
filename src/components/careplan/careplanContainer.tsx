"use client";

import { CarePlanData, CarePlanDataActivity } from "@/lib/models/types";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

type Props = {
  action: (data: FormData) => Promise<any>;
  toVersion: (version: number) => void;
  data: CarePlanData;
  latestVersion: number;
  setCurrentVersion: (version: number) => void;
};

export const CarePlanContainer = ({
  data,
  action,
  toVersion,
  latestVersion,
  setCurrentVersion,
}: Props) => {
  const [careplan, setCarePlan] = useState<CarePlanData>(data);
  const [items, setItems] = useState<CarePlanDataActivity[]>();
  const [selectFix, setSelectFix] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [hasFixableItems, setHasFixableItems] = useState(false);

  const submit = async () => {
    setLoading(true);
    const form = new FormData();
    form.append(
      "data",
      JSON.stringify({
        careplan: careplan,
        items: items,
      })
    );
    const responses = await action(form);
    setSelectFix(false);
    setItems([]);
    setCarePlan(responses);
    setLoading(false);
  };

  useEffect(() => {
    setHasFixableItems(
      careplan.activities.some(
        (e) =>
          (!e.isTaskAndCarePlanSameStatus || !e.taskExists) &&
          e.taskType == "normal"
      )
    );
  }, [careplan]);

  return (
    <>
      <div className="p-2 flex flex-row gap-2">
        {hasFixableItems && (
          <button
            className={"btn " + (selectFix ? "btn-error" : "btn-secondary")}
            onClick={() => {
              if (selectFix) {
                setSelectFix(false);
                setItems([]);
              } else {
                setSelectFix(true);
                setItems([]);
              }
            }}
          >
            {selectFix ? "Cancel" : "Select issues to fix"}
          </button>
        )}
        {selectFix && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setItems(
                careplan.activities.filter(
                  (e) =>
                    (!e.isTaskAndCarePlanSameStatus || !e.taskExists) &&
                    e.taskType == "normal"
                )
              );
            }}
          >
            Select all
          </button>
        )}
        {(items?.length ?? 0) > 0 && (
          <button
            className="btn btn-primary"
            onClick={() => {
              submit();
            }}
          >
            Fix items
          </button>
        )}
      </div>
      {loading && (
        <div className="flex flex-col gap-4 w-full p-8">
          <p>Working...</p>
          <progress className="progress w-full"></progress>
        </div>
      )}
      <div className="flex flex-col gap-4">
        <div>
          {careplan && (
            <CarePlanSummary
              careplan={careplan}
              lastestVersion={latestVersion}
              setCurrentVersion={setCurrentVersion}
              previous={() => toVersion(careplan.version - 1)}
              next={() => toVersion(careplan.version + 1)}
            />
          )}
        </div>
        <h5 className="scroll-m-20 text-4xl font-bold tracking-tight">Tasks</h5>
        {careplan.activities?.map((activity: CarePlanDataActivity) => {
          return (
            <details key={activity.task} className="collapse bg-base-200">
              <summary className="collapse-title text-xl font-medium">
                <div className="flex flex-row gap-2 items-center p-2">
                  {selectFix &&
                    (activity.taskReference != undefined ||
                      activity.taskReference != null) &&
                    (!activity.isTaskAndCarePlanSameStatus ||
                      !activity.taskExists) && (
                      <input
                        type="checkbox"
                        checked={
                          items?.find(
                            (e) => e.taskReference == activity.taskReference
                          ) !== undefined
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setItems([...(items ?? []), activity]);
                          } else {
                            setItems(
                              items?.filter(
                                (e) => e.taskReference != activity.taskReference
                              )
                            );
                          }
                        }}
                        className="checkbox"
                      />
                    )}
                  <p>{activity.task}</p>
                </div>
                <div className="flex flex-row gap-2">
                  {activity.taskType == "normal" && (
                    <>
                      {activity.taskExists == false && (
                        <div className="badge badge-error gap-2">
                          Task Missing
                        </div>
                      )}
                      {activity.isTaskAndCarePlanSameStatus == false && (
                        <div className="badge badge-error gap-2">
                          Status different
                        </div>
                      )}
                    </>
                  )}
                  {activity.taskType == "scheduled" && (
                    <div className="badge badge-accent">Scheduled Task</div>
                  )}
                </div>
                <div className="">
                  <div className="flex flex-col p-2">
                    <div className="flex flex-row gap-2">
                      <span className="badge badge-neutral p-2">
                        CarePlan Status: {activity.carePlanActivityStatus}
                      </span>
                      <span className="badge badge-primary p-2">
                        Task Status: {activity.taskStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </summary>
            </details>
          );
        })}
      </div>
    </>
  );
};

const CarePlanSummary = ({
  careplan,
  lastestVersion,
  previous,
  next,
  setCurrentVersion,
}: {
  careplan: CarePlanData;
  lastestVersion: number;
  previous: () => void;
  next: () => void;
  setCurrentVersion: (version: number) => void;
}) => {
  return (
    <div>
      <details className="collapse bg-base-200">
        <summary className="collapse-title text-xl font-medium">
          <div className="flex flex-row justify-between w-full items-center">
            <span>View Care Plan Details</span>
            <div className="flex flex-row gap-2 items-center">
              {careplan.version != lastestVersion && (
                <Button onClick={() => setCurrentVersion(careplan.version)}>
                  Set as Current version
                </Button>
              )}
              {careplan.version > 1 && (
                <Button variant="link" onClick={previous}>
                  {" "}
                  {"< "} Previous
                </Button>
              )}
              <span className="badge badge-primary">
                Version: {careplan.version}
              </span>
              {careplan.version < lastestVersion && (
                <Button variant="link" onClick={next}>
                  Next {" >"}
                </Button>
              )}
            </div>
          </div>
        </summary>
        <div className="collapse-content">
          <h6>{careplan.title}</h6>
          <div>
            <div>
              <span>Patient: </span>
              <span>{careplan.patientId}</span>
            </div>
            <div>
              <span>Requester: </span>
              <span>{careplan.requester?.toString()}</span>
            </div>
            <div>
              <span>Author: </span>
              <span>{careplan.author?.toString()}</span>
            </div>
            <div>
              <span>Visit Number: </span>
              <span>{careplan.visitNumber}</span>
            </div>
            <div>
              <h6 className="">Tags: </h6>
              <div className="flex flex-col p-2">
                {careplan.tags.map((tag) => (
                  <span key={tag.code}>
                    {tag.display} : {tag.code}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </details>
    </div>
  );
};
