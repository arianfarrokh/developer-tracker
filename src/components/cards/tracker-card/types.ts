import type { ReactNode } from "react";
import type { TrackerStatusOption } from "./status";

export type TrackerCardWorkItem = {
  id: string;
  task: string;
  count?: number;
  status?: string;
  completedAt?: string | null;
  statusChangePending?: boolean;
};

export type TrackerCardData = {
  id: string;
  title: string;
  description?: string | null;
  progress?: number;
  status?: string;
  priority?: number;
  workItems?: TrackerCardWorkItem[];
};

export type TrackerCardActions = {
  onDuplicate?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddWorkItem?: (parentId: string) => void;
  onToggleWorkItemComplete?: (workItemId: string, completed: boolean) => void;
  onWorkItemStatusChange?: (
    workItemId: string,
    status: string,
    parentId: string,
    workItemIndex: number,
  ) => void;
};

export type TrackerCardLabels = {
  workItemsTitle?: string;
  noWorkItems?: string;
  addWorkItem?: string;
  duplicate?: string;
  edit?: string;
  delete?: string;
  toggleWorkItem?: string;
};

export type TrackerCardProps = {
  data: TrackerCardData;
  actions?: TrackerCardActions;
  labels?: TrackerCardLabels;
  className?: string;
  /** Max visible work items before the list scrolls */
  maxVisibleWorkItems?: number;
  /** Optional slot — avatar, logo, illustration */
  media?: ReactNode;
  workItemStatusOptions?: TrackerStatusOption[];
};
