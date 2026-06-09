export function buildRoute(
  base: string,
  ...segments: (string | number | undefined | null)[]
): string {
  return [base, ...segments]
    .filter((val) => val !== undefined && val !== null && val !== '')
    .join('/')
    .replace(/\/+/g, '/');
}
