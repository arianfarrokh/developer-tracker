const WORK_ITEM_STATUS_VALUES = [
  "TODO",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const satisfies readonly WorkItemStatusEnum[];

export function isWorkItemStatusEnum(
  value: string,
): value is WorkItemStatusEnum {
  return WORK_ITEM_STATUS_VALUES.includes(value as WorkItemStatusEnum);
}

/** Normalize legacy UI labels to API enum values when reading older data. */
export function normalizeWorkItemStatus(
  status: string | undefined,
): WorkItemStatusEnum {
  const upper = status?.toUpperCase() ?? "TODO";
  if (upper === "DONE") return "COMPLETED";
  if (upper === "BLOCKED") return "CANCELLED";
  if (isWorkItemStatusEnum(upper)) return upper;
  return "TODO";
}
