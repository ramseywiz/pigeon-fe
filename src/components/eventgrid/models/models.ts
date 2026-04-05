export interface EventListRow {
  id: string;
  eventName: string;
  startDate: Date;
  startTime: string;
  endDate: Date;
  endTime: string;
  location: string;
  branch: string;
  description: string;
  food: boolean;
  imageUrl: File | null;
}
