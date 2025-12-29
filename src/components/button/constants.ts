// src/components/button/constants.ts
export const BUTTON_TYPE = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  TETIARY: 'tetiary'
} as const;

export type ButtonVariant =
  typeof BUTTON_TYPE[keyof typeof BUTTON_TYPE];