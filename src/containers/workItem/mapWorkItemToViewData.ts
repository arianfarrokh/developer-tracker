import { normalizeWorkItemStatus } from "@/containers/goals/workItemStatusApi";
import type { WorkItemByIdType } from "./graphql/type";
import type { WorkItemViewData } from "./types";

export function mapWorkItemToViewData(item: WorkItemByIdType): WorkItemViewData {
  return {
    goalTitle: item.goal.title,
    task: item.task,
    description: item.description,
    workItemStatus: normalizeWorkItemStatus(item.workItemStatus),
    dueDate: item.dueDate,
    completedAt: item.completedAt,
  };
}