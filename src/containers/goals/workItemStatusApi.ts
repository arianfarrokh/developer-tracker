const SYNTHETIC_WORK_ITEM_ID = /-work-item-\d+$/;
const NIL_UUID = "00000000-0000-0000-0000-000000000000";

const WORK_ITEM_STATUS_VALUES = [
  "TODO",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const satisfies readonly WorkItemStatusEnum[];

export function isUsableWorkItemId(
  id: string | undefined | null,
): id is string {
  if (!id) return false;
  if (id === NIL_UUID) return false;
  if (SYNTHETIC_WORK_ITEM_ID.test(id)) return false;
  return true;
}

export function workItemRowId(
  goalId: string,
  item: { id: string },
  index: number,
): string {
  return isUsableWorkItemId(item.id) ? item.id : `${goalId}-work-item-${index}`;
}

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
