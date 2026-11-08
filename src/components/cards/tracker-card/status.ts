import { cn } from "@/lib/utils";

const DEFAULT_STATUS_STYLE =
  "border-border/70 bg-muted/40 text-muted-foreground";

/** Surfaces + text — uses DevDash CSS tokens (primary, muted, success, …) */
export const TRACKER_STATUS_STYLES: Record<string, string> = {
  TODO: "border-border/80 bg-muted/60 text-muted-foreground",
  IN_PROGRESS: "border-info/40 bg-info/15 text-info",
  DONE: "border-success/40 bg-success/15 text-success",
  COMPLETED: "border-success/40 bg-success/15 text-success",
  BLOCKED: "border-destructive/40 bg-destructive/15 text-destructive",
  ON_HOLD: "border-warning/40 bg-warning/15 text-warning",
  PAUSED: "border-warning/40 bg-warning/15 text-warning",
  ACTIVE: "border-primary/40 bg-primary/15 text-primary",
  PLANNING: "border-accent/40 bg-accent/15 text-accent-foreground",
};

/** Accent dots for dropdown items */
export const TRACKER_STATUS_DOT: Record<string, string> = {
  TODO: "bg-muted-foreground",
  IN_PROGRESS: "bg-info",
  DONE: "bg-success",
  COMPLETED: "bg-success",
  BLOCKED: "bg-destructive",
  ON_HOLD: "bg-warning",
  PAUSED: "bg-warning",
  ACTIVE: "bg-primary",
  PLANNING: "bg-accent",
};

export function formatTrackerStatus(status: string | undefined): string {
  if (!status) return "—";
  return status.replaceAll("_", " ");
}

export function getTrackerStatusClass(status: string | undefined): string {
  const key = status?.toUpperCase() ?? "";
  return TRACKER_STATUS_STYLES[key] ?? DEFAULT_STATUS_STYLE;
}

export function getTrackerStatusDotClass(status: string | undefined): string {
  const key = status?.toUpperCase() ?? "";
  return TRACKER_STATUS_DOT[key] ?? "bg-muted-foreground";
}

export function trackerStatusBadgeClass(status: string | undefined): string {
  return cn(
    "inline-flex max-w-full items-center truncate rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
    getTrackerStatusClass(status),
  );
}

export function priorityBadge(priority: number | undefined): {
  emoji: string;
  tone: string;
} {
  const value = priority ?? 0;
  if (value >= 8) {
    return {
      emoji: "🥇",
      tone: "border-warning/40 bg-warning/15 text-warning",
    };
  }
  if (value >= 4) {
    return {
      emoji: "🔥",
      tone: "border-destructive/30 bg-destructive/10 text-destructive",
    };
  }
  return {
    emoji: "✦",
    tone: "border-primary/35 bg-primary/10 text-primary",
  };
}

export function shortenDisplayId(id: string): string {
  const compact = id.replace(/-/g, "");
  if (compact.length <= 6) return `ID ${compact}`;
  return `ID …${compact.slice(-3)}`;
}

export type TrackerStatusOption = {
  value: string;
  label: string;
};

export const DEFAULT_WORK_ITEM_STATUS_OPTIONS: TrackerStatusOption[] = [
  { value: "TODO", label: "Todo" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "DONE", label: "Done" },
  { value: "BLOCKED", label: "Blocked" },
];

export function mergeWorkItemStatusOptions(
  currentStatus: string | undefined,
  options: TrackerStatusOption[] = DEFAULT_WORK_ITEM_STATUS_OPTIONS,
): TrackerStatusOption[] {
  if (!currentStatus) return options;
  const normalized = currentStatus.toUpperCase();
  if (options.some((option) => option.value === normalized)) {
    return options;
  }
  return [
    {
      value: normalized,
      label: formatTrackerStatus(normalized),
    },
    ...options,
  ];
}

export const workItemStatusSelectTriggerClassName =
  "h-7 w-[7.25rem] max-w-[7.25rem] min-w-0 border-border/80 px-2 text-[10px] font-semibold uppercase tracking-wide shadow-none dark:bg-card/80";
