// src/components/table/types.ts
export type TableColumn<T> = {
  key: keyof T;
  header: string;
  render?: (row: T) => React.ReactNode;
};

export type TableAction<T> = {
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  onClick: (row: T) => void;
};