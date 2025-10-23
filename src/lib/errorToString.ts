export type ErrorVal = string | string[] | undefined;
export function errorToString(error: ErrorVal): string | undefined {
  if (!error) return undefined;
  return Array.isArray(error) ? error.join(" ") : error;
}
