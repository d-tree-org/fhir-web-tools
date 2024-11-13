export type FacilityResultData = {
  groups: GroupedSummaryItem[];
  date: string;
  generatedDate: string;
};

export type GroupedSummaryItem = {
  groupKey: string;
  groupTitle: string;
  summaries: SummaryItem[];
  order: number;
  startCollapsed: boolean;
};

export type SummaryItem = {
  name: string;
  value: number;
};


export type FacilityTracingData = {
  total: number;
  homeTotal: number;
  phoneTotal: number;
}