export type Language = "sv" | "fi" | "en";

export type LanguageStrings = Record<
  string,
  Record<Language, string | string[] | (() => string | string[])>
>;
