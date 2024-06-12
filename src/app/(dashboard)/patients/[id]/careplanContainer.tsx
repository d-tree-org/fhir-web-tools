"use client";

import { useState } from "react";
import { CarePlanData, CarePlanDataActivity } from "./types";

type Props = {
  action: (data: FormData) => Promise<any>;
  data: CarePlanData;
};

export const CarePlanContainer = ({ data, action }: Props) => {
  const [careplan, setCarePlan] = useState<CarePlanData>(data);
  const [items, setItems] = useState<CarePlanDataActivity[]>();
  const [selectFix, setSelectFix] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

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

  return (
    <>
      <div className="p-2 flex flex-row gap-2">
        <button
          className="btn btn-primary"
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
          Select Tasks to fix
        </button>
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
      <h6>Tasks</h6>
      {loading && (
        <div className="flex flex-col gap-4 w-full p-8">
          <p>Working...</p>
          <progress className="progress w-full"></progress>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {" "}
        {careplan.activities?.map((activity: CarePlanDataActivity) => {
          return (
            <details key={activity.task} className="collapse bg-base-200">
              <summary className="collapse-title text-xl font-medium">
                <div className="flex flex-row gap-2 items-center p-2">
                  {selectFix &&
                    (activity.taskReference != undefined ||
                      activity.taskReference != null) && (
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
                  {activity.taskExists == false && (
                    <div className="badge badge-error gap-2">Task Missing</div>
                  )}
                  {activity.isTaskAndCarePlanSameStatus == false && (
                    <div className="badge badge-error gap-2">
                      Status different
                    </div>
                  )}
                </div>
              </summary>
              <div className="collapse-content">
                <div className="flex flex-col p-2">
                  <div className="flex flex-row gap-2">
                    <span className="badge badge-secondary">
                      CarePlan Status: {activity.carePlanActivityStatus}
                    </span>
                    <span className="badge badge-secondary">
                      Task Status: {activity.taskStatus}
                    </span>
                  </div>
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </>
  );
};
