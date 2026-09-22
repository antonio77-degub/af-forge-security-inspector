export function safeNextPath(value: string | null | undefined): string {
  if (!value) return '/';

  const candidate = value.trim();
  if (!candidate.startsWith('/') || candidate.startsWith('//') || candidate.includes('\\')) {
    return '/';
  }

  return candidate;
}
