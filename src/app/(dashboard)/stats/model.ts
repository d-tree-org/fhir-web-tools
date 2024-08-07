export const fixDate = (date: string | string[]) => {
  return date;
  // return addDays(date, 1).toISOString();
};

export class QueryParam {
  queries: Map<string, string> = new Map();
  encodeUrl: boolean = false;

  constructor(values: Record<string, string>, encodeUrl: boolean = false) {
    this.from(values);
    this.encodeUrl = encodeUrl;
  }

  add(key: string, value: any) {
    if (this.queries.has(key)) {
      this.queries.set(`${key}[${Math.random()}]`, value);
    } else {
      this.queries.set(key, value);
    }
  }

  get(key: string) {
    return this.queries.get(key);
  }

  set(key: string, value: any) {
    this.queries.set(key, value);
  }

  remove(key: string) {
    this.queries.delete(key);
  }

  from(values: Record<string, string>) {
    for (const key in values) {
      this.add(key, values[key]);
    }
  }

  has(key: string) {
    return this.queries.has(key);
  }

  fromArray(values: Record<string, string>[]) {
    for (const key in values) {
      this.from(values[key]);
    }
  }

  toUrl(resources: string) {
    const query = Array.from(this.queries)
      .map(([key, value]) => {
        if (key.includes("[")) {
          return `${key.split("[")[0]}=${
            this.encodeUrl ? encodeURIComponent(value) : value
          }`;
        }
        return `${key}=${this.encodeUrl ? encodeURIComponent(value) : value}`;
      })
      .join("&");
    return `${resources}?${query}`;
  }
}
