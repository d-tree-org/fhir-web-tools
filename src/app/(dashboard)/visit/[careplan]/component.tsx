"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CarePlanListItem, CarePlanStatus, carePlanStatus } from "./models";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

type Props = {
  id: string;
  data: CarePlanListItem | null;
  onCarePlanStatusChange: (
    id: string,
    status: CarePlanStatus
  ) => Promise<null | undefined>;
};

const Components = ({ data, id, onCarePlanStatusChange }: Props) => {
  const router = useRouter();
  const [status, setStatus] = React.useState<CarePlanStatus | null | undefined>(
    data?.status
  );
  const [loading, setLoading] = React.useState(false);
  return (
    <div className="space-y-2">
      <div className="flex flex-row gap-2 items-end">
        <Label>Status</Label>
        <Select
          onValueChange={(value) => setStatus(value as CarePlanStatus)}
          defaultValue={data?.status}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a verified email to display" />
          </SelectTrigger>
          <SelectContent>
            {carePlanStatus.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {status !== data?.status && (
          <Button
            disabled={loading}
            onClick={async () => {
              if (status) {
                setLoading(true);
                await onCarePlanStatusChange(id, status);
                setLoading(false);
                window.location.reload();
              }
            }}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Components;
