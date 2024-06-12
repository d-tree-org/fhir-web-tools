import { fhirR4 } from "@smile-cdr/fhirts";
import { fhirServer } from "../api/axios";
import { AxiosError } from "axios";

export const pushResourceBundle = async (resources: fhirR4.Resource[]) => {
  try {
    const bundle = new fhirR4.Bundle();
    bundle.type = "transaction";
    const entrries: fhirR4.BundleEntry[] = [];
    for (const resource of resources) {
      const entry = new fhirR4.BundleEntry();
      entry.resource = resource;
      entry.request = new fhirR4.BundleRequest();
      entry.request.method = "PUT";
      entry.request.url = `${resource.resourceType}/${resource.id}`;
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
    }
  }
};
