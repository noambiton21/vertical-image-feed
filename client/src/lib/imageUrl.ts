export function withWidth(url: string, width: number): string {
  const parsed = new URL(url);
  parsed.searchParams.set('w', String(width));
  return parsed.toString();
}
