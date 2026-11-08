import type { TrackerCardData } from "@/components/cards/tracker-card";
import { normalizeWorkItemStatus } from "./workItemStatusApi";

export function mapGoalToTrackerCard(
  goal: AllGoalsQueryResultType,
): TrackerCardData {
  return {
    id: goal.id,
    title: goal.title,
    description: goal.description,
    priority: goal.priority,
    progress: goal.progress,
    status: goal.goalStatus,
    workItems: goal.workItems.map((item) => ({
      id: item.id,
      task: item.task,
      count: item.count,
      status: normalizeWorkItemStatus(item.workItemStatus),
      completedAt: item.completedAt,
    })),
  };
}
