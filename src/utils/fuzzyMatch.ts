export function fuzzyMatch(text: string, term: string) {
  if (!term) return true
  return text.toLowerCase().includes(term.toLowerCase())
}
