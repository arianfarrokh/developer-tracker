export type WorkItemByIdGoalType = {
  id: ID;
  title: string;
  progress: number;
};

export type WorkItemByIdType = {
  id: ID;
  task: string;
  description?: string | null;
  workItemStatus: WorkItemStatusEnum;
  completedAt: string | null;
  dueDate: string | null;
  count: number;
  goal: WorkItemByIdGoalType;
};

export type WorkItemByIdQueryData = {
  workItemById: WorkItemByIdType | null;
};

export type WorkItemType = WorkItemByIdType;

export type GoalType = WorkItemByIdGoalType & {
  description?: string;
};