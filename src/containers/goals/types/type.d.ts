type GoalWorkItemQueryResultType = {
  id: ID;
  task: string;
  goalId: ID;
  count: number;
  dueDate: string | null;
  completedAt: string | null;
  workItemStatus: string;
};

type AllGoalsQueryResultType = {
  id: ID;
  title: string;
  description: string;
  priority: number;
  progress: number;
  goalStatus: string;
  workItems: GoalWorkItemQueryResultType[];
};

type WorkItemStatusEnum = "TODO" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

type UpdateWorkItemStatusInput = {
  id: ID;
  newStatus: WorkItemStatusEnum;
};

type ChangeWorkItemStatusMutationData = {
  updateWorkItemStatus: {
    result: GoalWorkItemQueryResultType | null;
    errors: { message: string }[] | null;
  } | null;
};
