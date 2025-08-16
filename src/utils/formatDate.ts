import { format, isToday, isYesterday, parseISO } from "date-fns"

export function formatDate(dateInput: string | Date) {
  const date = typeof dateInput === "string" ? parseISO(dateInput) : dateInput

  if (isToday(date)) return "Today"
  if (isYesterday(date)) return "Yesterday"

  return format(date, "EEE, MMM d yyyy")
}
