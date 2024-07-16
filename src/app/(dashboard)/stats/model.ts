import { randomInt } from "crypto";
import { addDays } from "date-fns";

export const fixDate = (date: string) => {
  return date;
  // return addDays(date, 1).toISOString();
}

export class QueryParam {
  queries: Map<string, string> = new Map();
  constructor(values: Record<string, string>) {
    this.from(values);
  }

  add(key: string, value: any) {
    console.log(key,this.queries.has(key) );
    
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
    console.log(values);
    console.log(this.queries);
    
  }

  toUrl( resources: string,) {
    console.log(this.queries);
    const query = Array.from(this.queries)
      .map(([key, value]) => {
        if (key.includes("[")) {
          return `${key.split("[")[0]}=${value}`;
        }
        return `${key}=${value}`;
      })
      .join("&");
      return `${resources}?${query}`;
  }
}
