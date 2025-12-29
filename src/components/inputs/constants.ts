export const INPUT_TYPES = {
  TEXT: "text",
  EMAIL: "email",
  PASSWORD: "password",
  NUMBER: "number",
  DATE: "date",
  SEARCH: "search",
  TEL: "tel",
  URL: "url",
  TEXTAREA: "textarea",
} as const;

export type InputType = typeof INPUT_TYPES[keyof typeof INPUT_TYPES];

export const AUTOCOMPLETE = {
  EMAIL: "email",
  USERNAME: "username",
  CURRENT_PASSWORD: "current-password",
  NEW_PASSWORD: "new-password",
  NAME: "name",
  GIVEN_NAME: "given-name",
  FAMILY_NAME: "family-name",
  TEL: "tel",
  OFF: "off",
} as const;

export type AutoCompleteType =
  typeof AUTOCOMPLETE[keyof typeof AUTOCOMPLETE];