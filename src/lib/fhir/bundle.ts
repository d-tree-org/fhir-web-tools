import { fhirR4, BundleUtilities } from "@smile-cdr/fhirts";
import { fhirServer } from "../api/axios";
import { AxiosError } from "axios";
import { IBundle } from "@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle";

export type BinaryPatchData = {
  data: fhirR4.Binary;
  path: string;
  isBinary: boolean;
};

export const pushResourceBundle = async (
  resources: (fhirR4.Resource | BinaryPatchData)[]
) => {
  try {
    const bundle = new fhirR4.Bundle();
    bundle.type = "transaction";
    const entrries: fhirR4.BundleEntry[] = [];
    for (const resource of resources) {
      const entry = new fhirR4.BundleEntry();
      if ("isBinary" in resource) {
        entry.resource = resource.data;
        entry.request = new fhirR4.BundleRequest();
        entry.request.method = "PATCH";
        entry.request.url = resource.path;
      } else {
        entry.resource = resource;
        entry.request = new fhirR4.BundleRequest();
        entry.request.method = "PUT";
        entry.request.url = `${resource.resourceType}/${resource.id}`;
      }
      entrries.push(entry);
    }

    bundle.entry = entrries;
    bundle.resourceType = "Bundle";
    console.log(JSON.stringify(bundle));
    const response = await fhirServer.post("/", bundle);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
    } else {
      console.log(error);
    }
  }
};

export const fetchBundle = async (
  requests: string[]
): Promise<fhirR4.Bundle> => {
  const bundle: IBundle = {
    resourceType: "Bundle",
    type: "transaction",
  };
  bundle.entry = requests.map((request) => {
    return {
      request: {
        method: "GET",
        url: request,
      },
    };
  });
  console.log(JSON.stringify(bundle));

  const response = await fhirServer.post("/", bundle);
  return response.data;
};
