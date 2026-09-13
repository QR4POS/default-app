export function getInitials(
  name?: string | null,
  email?: string | null,
): string {
  const source = (name || email || "?").trim();
  const parts = source.split(/[\s@]+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}
