import type { TrackerCardData } from "@/components/cards/tracker-card";

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
      status: item.workItemStatus,
      completedAt: item.completedAt,
    })),
  };
}
