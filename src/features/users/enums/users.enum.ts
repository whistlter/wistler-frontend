export const users = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
} as const;

type users = typeof users[keyof typeof users];