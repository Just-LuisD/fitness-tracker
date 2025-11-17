export type WeightUnit = "kg" | "lb";

export interface WeightEntry {
  id: number;
  weight: number;
  unit: WeightUnit;
  date: string; // ISO 8601
}
