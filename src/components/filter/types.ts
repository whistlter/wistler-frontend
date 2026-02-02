// src/components/filter/types.ts
export type FilterSubOption = {
  label: string;
  value: string;
  isSelected?: boolean;
};

export type FilterOption = {
  label: string;
  value: string;
  icon?: string;
  subOptions?: FilterSubOption[];
};