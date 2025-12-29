// src/components/inputs/inputConfig.ts

import { AppIcons } from "@/constant/constant";


export type InputConfig = {
  /** SVG path from AppIcons */
  leftIcon?: string;
  /** Show password eye toggle */
  rightToggle?: boolean;
  /** Debounce delay (ms) */
  debounce?: number;
  /** Validation logic per input type */
  validate?: (val: string) => string | null;
};

export const INPUT_CONFIG: Record<string, InputConfig> = {
  email: {
    leftIcon: AppIcons.mail,
    validate: (val) =>
      /^\S+@\S+\.\S+$/.test(val) ? null : "Invalid email address",
  },

  password: {
    leftIcon: AppIcons.lock,
    rightToggle: true,
    validate: (val) =>
      val.length >= 8 ? null : "Password must be at least 8 characters",
  },

  search: {
    leftIcon: AppIcons.search,
    debounce: 400,
  },

  text: {},
  number: {},
  textarea: {},
};