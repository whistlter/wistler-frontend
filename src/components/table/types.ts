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
  // Dynamic properties based on row data
  getLabel?: (row: T) => string;
  getIcon?: (row: T) => React.ReactNode;
  getDanger?: (row: T) => boolean;
};