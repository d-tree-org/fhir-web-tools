import React from "react";
import HiddenText from "@/components/hidden.text";
import { Button } from "@/components/ui/button";
import { Patient } from "@/lib/fhir/types";
import { CarePlanData } from "@/lib/models/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Props = {
  patient: Patient;
  carePlan: CarePlanData | null | undefined;
};

const PatientInfo = ({ patient, carePlan }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row flex-wrap gap-4 items-center">
        <h1 className="text-2xl font-bold">{patient.name}</h1>
        <div className="flex flex-row gap-2 items-center">
          <span>{patient.gender}</span>
          <span>{getAge(patient.birthDate)} years old</span>
        </div>
      </div>
      <div className="flex flex-row gap-2 flex-wrap mt-2 w-full items-center">
        <div className="flex-1 flex flex-row flex-wrap w-full gap-4 items-center">
          {carePlan && (
            <div>
              {carePlan.title && (
                <p className="text-lg font-semibold">{carePlan.title}</p>
              )}
            </div>
          )}
          <HiddenText
            label="UUID"
            value={patient.id}
            className="text-sm text-gray-500"
          />
        </div>
        <div>
          {patient.links.length > 0 && (
            <Dialog>
              <DialogTrigger>
                <Button variant="outline">
                  Links{" "}
                  <span className="bg-primary rounded-full w-4 h-4 ml-1 flex justify-center items-center text-primary-foreground">
                    {patient.links.length}
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Patient Links</DialogTitle>
                  <div className="mt-2">
                    {
                      <ul className="flex flex-col gap-2">
                        {patient.links.map((link) => (
                          <Card key={link.id}>
                            <CardContent className="!p-6">
                              <div className="flex flex-row gap-2 items-center">
                                <Avatar className="hidden h-9 w-9 sm:flex">
                                  <AvatarFallback>
                                    {link.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="grid gap-1">
                                  <p className="text-sm font-medium leading-none">
                                    {link.name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {link.id}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </ul>
                    }
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

function getAge(dateString: string) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var month = today.getMonth() - birthDate.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export default PatientInfo;
