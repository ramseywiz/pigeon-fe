export interface EventDto {
  id: string;
  eventName: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
  branch: string;
  description: string;
  food: boolean;
  cost: number | null;
  imageUrl: string | null;
  archived: boolean;
}
