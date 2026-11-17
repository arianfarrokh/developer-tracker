export function fromDateInputValue(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return null;
    return `${trimmed}T00:00:00.000Z`;
  }
  

  export function formatDisplayDate(value: string | null | undefined): string {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...(value.includes("T") ? { hour: "2-digit", minute: "2-digit" } : {}),
    }).format(date);
  }
  
  export function toDateInputValue(iso: string | null | undefined): string {
    if (!iso?.trim()) return "";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  