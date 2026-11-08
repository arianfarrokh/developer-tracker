import type { TrackerStatusOption } from "@/components/cards/tracker-card";

/** Matches server `WorkItemStatus` GraphQL enum (HotChocolate). */
export const GOAL_WORK_ITEM_STATUS_OPTIONS: TrackerStatusOption[] = [
  { value: "TODO", label: "انجام نشده" },
  { value: "IN_PROGRESS", label: "در حال انجام" },
  { value: "COMPLETED", label: "انجام شده" },
  { value: "CANCELLED", label: "لغو شده" },
];
