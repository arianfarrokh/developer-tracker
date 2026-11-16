import type { ReactNode } from "react";
import type { TrackerStatusOption } from "./status";

export type TrackerCardWorkItem = {
  id: string;
  task: string;
  description?: string | null;
  count?: number;
  status?: string;
  dueDate?: string | null;
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

export type TrackerWorkItemDraftInput = {
  task: string;
  description?: string | null;
  count: number;
  dueDate?: Date;
  workItemStatus: string;
};

export type UpdatedTrackerWorkItemInput = TrackerWorkItemDraftInput & {
  workItemId: string;
};

export type SaveTrackerWorkItemsInput = {
  trackerId: string;
  created: TrackerWorkItemDraftInput[];
  updated: UpdatedTrackerWorkItemInput[];
  deletedWorkItemIds: string[];
};

export type TrackerCardActions = {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSaveWorkItems?: (
    input: SaveTrackerWorkItemsInput,
  ) =>
    | boolean
    | TrackerCardWorkItem[]
    | void
    | Promise<boolean | TrackerCardWorkItem[] | void>;
  onToggleWorkItemComplete?: (workItemId: string, completed: boolean) => void;
  onWorkItemStatusChange?: (
    workItemId: string,
    status: string,
    parentId: string,
    workItemIndex: number,
  ) => void;
  onWorkItemOpen?: (workItemId: string, goalId: string) => void;
};

export type TrackerCardLabels = {
  workItemsTitle?: string;
  noWorkItems?: string;
  addWorkItem?: string;
  duplicate?: string;
  edit?: string;
  delete?: string;
  toggleWorkItem?: string;
  placeholder?: string;
  workItemDescriptionPlaceholder?: string;
  creatingWorkItem?: string;
  saveWorkItem?: string;
  updatingWorkItem?: string;
  deleteWorkItem?: string;
  deletingWorkItem?: string;
  deleteWorkItemTitle?: string;
  deleteWorkItemDescription?: string;
  cancel?: string;
  done?: string;
  savingChanges?: string;
  discardChanges?: string;
  unsavedChanges?: string;
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
