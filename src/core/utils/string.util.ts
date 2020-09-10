export function escapeRegexSpecialCharacters(string: string): string {
  return string.replace(/[<>*()?]/g, '\\$&');
}
