import { WeightUnit } from "../database/types";

export const lbToKg = (lb: number) => lb * 0.45359237;
export const kgToLb = (kg: number) => kg / 0.45359237;

export const convertWeight = (
  value: number,
  from: WeightUnit,
  to: WeightUnit
): number => {
  if (from === to) return value;
  return from === "kg" ? kgToLb(value) : lbToKg(value);
};
