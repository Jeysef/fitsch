import type { ClassValue } from "clsx";
import clsx from "clsx";
import { divide, multiply, round } from "lodash-es";
import { twMerge } from "tailwind-merge";

export const cn = (...classLists: ClassValue[]) => twMerge(clsx(classLists));

type EnumType = Record<string, string | number>;
type EnumValue<T extends EnumType> = T[keyof T];

export function valueToEnumValue<T extends EnumType>(value: string, anEnum: T): EnumValue<T> {
  const enumValue = Object.values(anEnum).find((enumValue) => enumValue === value) as EnumValue<T>;
  if (!enumValue) {
    throw new Error(`Value ${value} is not a valid enum value`);
  }
  return enumValue;
}

export function percentage(part: number, total: number, decimals = 2) {
  return round(multiply(divide(part, total), 100), decimals);
}
