import type { TrackerStatusOption } from "@/components/cards/tracker-card";

export const GOAL_WORK_ITEM_STATUS_OPTIONS: TrackerStatusOption[] = [
  { value: "TODO", label: "انجام نشده" },
  { value: "IN_PROGRESS", label: "در حال انجام" },
  { value: "DONE", label: "انجام شده" },
  { value: "BLOCKED", label: "مسدود" },
];
