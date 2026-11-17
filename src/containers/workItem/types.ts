export type WorkItemViewData = {
  goalTitle: string;
  task: string;
  description?: string | null;
  workItemStatus: string;
  dueDate: string | null;
  completedAt: string | null;
};

export type WorkItemFormValues = {
  goalTitle: string;
  task: string;
  description: string;
  workItemStatus: string;
  dueDate: string | null;
  completedAt: string | null;
};