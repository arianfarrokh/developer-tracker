import { isUsableWorkItemId } from "./workItemStatusApi";

function overlayFromCatalog(
  item: GoalWorkItemQueryResultType,
  catalogItem: GoalWorkItemQueryResultType,
): GoalWorkItemQueryResultType {
  return {
    ...item,
    id: catalogItem.id,
    task: catalogItem.task ?? item.task,
    goalId: catalogItem.goalId ?? item.goalId,
    count: catalogItem.count ?? item.count,
    workItemStatus: catalogItem.workItemStatus,
    completedAt: catalogItem.completedAt,
    dueDate: catalogItem.dueDate,
  };
}

/** allGoalsQuery nested work items often lack real ids/status — catalog is authoritative. */
export function mergeWorkItemIdsFromCatalog(
  goals: AllGoalsQueryResultType[],
  catalog: GoalWorkItemQueryResultType[],
): AllGoalsQueryResultType[] {
  const byGoal = new Map<string, GoalWorkItemQueryResultType[]>();
  for (const item of catalog) {
    if (!item.goalId) continue;
    const list = byGoal.get(item.goalId) ?? [];
    list.push(item);
    byGoal.set(item.goalId, list);
  }

  return goals.map((goal) => {
    const pool = byGoal.get(goal.id) ?? [];

    if (pool.length === 0) {
      return goal;
    }

    const nestedBroken = goal.workItems.some((w) => !isUsableWorkItemId(w.id));

    if (nestedBroken) {
      if (goal.workItems.length === pool.length) {
        return {
          ...goal,
          workItems: goal.workItems.map((item, index) =>
            overlayFromCatalog(item, pool[index]),
          ),
        };
      }

      return { ...goal, workItems: pool };
    }

    const byId = new Map(
      pool
        .filter((item) => isUsableWorkItemId(item.id))
        .map((item) => [item.id, item]),
    );

    const workItems = goal.workItems.map((item) => {
      if (!isUsableWorkItemId(item.id)) {
        return item;
      }
      const fromCatalog = byId.get(item.id);
      return fromCatalog ? overlayFromCatalog(item, fromCatalog) : item;
    });

    return { ...goal, workItems };
  });
}
