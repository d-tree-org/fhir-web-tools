export type Location = {
  id: string;
  name: string;
};

export type Bundle = {
  resourceType: "Bundle";
  type: "transaction";
  entry: BundleEntry[];
};

export type BundleEntry = {
  request: {
    method:
      | "GET"
      | "POST"
      | "PUT"
      | "DELETE"
      | "PATCH"
      | "HEAD"
      | "OPTIONS"
      | "TRACE"
      | "CONNECT"
      | "SEARCHTYPE";
    url: string;
  };
};
