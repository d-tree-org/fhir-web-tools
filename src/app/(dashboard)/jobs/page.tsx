"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, List } from "lucide-react";
import { fhirHelperServerClient } from "@/lib/api/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Loader from "@/components/loader";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Type definitions
interface Job {
  jobName: string;
  jobGroup: string;
  triggerCount?: number;
}

interface UpcomingJob {
  jobName: string;
  jobGroup: string;
  nextFireTime: string;
  previousFireTime?: string;
}

interface JobHistory {
  id: number;
  startTime: string;
  endTime: string | null;
  status: "RUNNING" | "SUCCESS" | "FAILED";
  message: string | null;
  retryCount: number;
}

const fetchActiveJobs = async (): Promise<Job[]> => {
  const response = await fhirHelperServerClient.get("/jobs/active");
  return response.data;
};

const fetchUpcomingJobs = async (): Promise<UpcomingJob[]> => {
  const response = await fhirHelperServerClient.get("/jobs/upcoming");
  return response.data;
};

function FetchError() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Something went wrong while fetching the data
      </AlertDescription>
    </Alert>
  );
}

const fetchJobHistory = async (
  jobName: string,
  jobGroup: string
): Promise<JobHistory[]> => {
  const response = await fhirHelperServerClient.get(
    `/jobs/${jobGroup}/${jobName}/history`
  );
  return response.data;
};

// Separate component for job history to manage individual job histories
function JobHistorySection({
  jobName,
  jobGroup,
}: {
  jobName: string;
  jobGroup: string;
}) {
  const {
    data: jobHistory,
    isLoading,
    isError,
  } = useQuery<JobHistory[]>({
    queryKey: ["quartzJobs", "history", jobName, jobGroup],
    queryFn: async () => await fetchJobHistory(jobName, jobGroup),
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          History for {jobName} ({jobGroup})
        </DialogTitle>
      </DialogHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Retry Count</TableHead>
            <TableHead>Message</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <Loader />
            </TableRow>
          )}
          {jobHistory?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5}>No history found</TableCell>
            </TableRow>
          )}
          {isError && (
            <TableRow>
              <TableCell colSpan={5}>
                <FetchError />
              </TableCell>
            </TableRow>
          )}
          {jobHistory?.map((history) => (
            <TableRow key={history.id}>
              <TableCell>
                {new Date(history.startTime).toLocaleString()}
              </TableCell>
              <TableCell>
                {history.endTime
                  ? new Date(history.endTime).toLocaleString()
                  : "N/A"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    history.status === "SUCCESS"
                      ? "default"
                      : history.status === "FAILED"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {history.status}
                </Badge>
              </TableCell>
              <TableCell>{history.retryCount}</TableCell>
              <TableCell>{history.message || "No message"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DialogContent>
  );
}

export default function QuartzJobManagement() {
  // Fetch active jobs
  const {
    data: activeJobs,
    isLoading: activeJobsLoading,
    isError: activeJobsError,
  } = useQuery<Job[]>({
    queryKey: ["quartzJobs", "active"],
    queryFn: fetchActiveJobs,
  });

  // Fetch upcoming jobs
  const {
    data: upcomingJobs,
    isLoading: upcomingJobsLoading,
    isError: upcomingJobsError,
  } = useQuery<UpcomingJob[]>({
    queryKey: ["quartzJobs", "upcoming"],
    queryFn: fetchUpcomingJobs,
  });

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2" /> Quartz Job Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">
              <List className="mr-2" /> Active Jobs
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              <Calendar className="mr-2" /> Upcoming Jobs
            </TabsTrigger>
          </TabsList>

          {/* Active Jobs Tab */}
          <TabsContent value="active">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Name</TableHead>
                  <TableHead>Job Group</TableHead>
                  <TableHead>Trigger Count</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeJobsLoading && (
                  <TableRow>
                    <Loader />
                  </TableRow>
                )}
                {activeJobs?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>No active jobs found</TableCell>
                  </TableRow>
                )}
                {activeJobsError && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <FetchError />
                    </TableCell>
                  </TableRow>
                )}
                {activeJobs?.map((job) => (
                  <TableRow key={`${job.jobGroup}-${job.jobName}`}>
                    <TableCell>{job.jobName}</TableCell>
                    <TableCell>{job.jobGroup}</TableCell>
                    <TableCell>{job.triggerCount || 0}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            View History
                          </Button>
                        </DialogTrigger>
                        <JobHistorySection
                          jobName={job.jobName}
                          jobGroup={job.jobGroup}
                        />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Upcoming Jobs Tab */}
          <TabsContent value="upcoming">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Name</TableHead>
                  <TableHead>Job Group</TableHead>
                  <TableHead>Next Fire Time</TableHead>
                  <TableHead>Previous Fire Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingJobsLoading && (
                  <TableRow>
                    <Loader />
                  </TableRow>
                )}
                {upcomingJobsError && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <FetchError />
                    </TableCell>
                  </TableRow>
                )}
                {upcomingJobs?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>No upcoming jobs found</TableCell>
                  </TableRow>
                )}
                {upcomingJobs?.map((job, index) => (
                  <TableRow key={index}>
                    <TableCell>{job.jobName}</TableCell>
                    <TableCell>{job.jobGroup}</TableCell>
                    <TableCell>
                      {new Date(job.nextFireTime).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {job.previousFireTime
                        ? new Date(job.previousFireTime).toLocaleString()
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
