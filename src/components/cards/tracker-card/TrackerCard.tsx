"use client";

import type { CSSProperties } from "react";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CustomProgress } from "@/components/progress/CustomProgress";
import { DatePicker } from "@/components/DatePicker/DatePicker";
import { cn } from "@/lib/utils";
import {
  Check,
  CheckCircle2,
  Circle,
  LoaderCircle,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  DEFAULT_WORK_ITEM_STATUS_OPTIONS,
  priorityBadge,
} from "./status";
import type { TrackerCardProps, TrackerCardWorkItem } from "./types";
import { WorkItemStatusSelect } from "./WorkItemStatusSelect";

const DEFAULT_LABELS = {
  workItemsTitle: "Work Items",
  noWorkItems: "No work items",
  addWorkItem: "Add work item",
  edit: "Edit",
  delete: "Delete",
  toggleWorkItem: "Toggle complete",
  placeholder: "Add new work item...",
  creatingWorkItem: "Creating work item",
  saveWorkItem: "Save changes",
  updatingWorkItem: "Updating work item",
  deleteWorkItem: "Delete work item",
  deletingWorkItem: "Deleting work item",
  deleteWorkItemTitle: "Delete work item",
  deleteWorkItemDescription: "Are you sure you want to delete this work item?",
  cancel: "Cancel",
  done: "Done",
  savingChanges: "Saving changes",
  discardChanges: "Discard changes",
  unsavedChanges: "Unsaved changes",
} as const;

function clampProgress(value: number | undefined): number {
  return Math.min(100, Math.max(0, value ?? 0));
}

export function TrackerCard({
  data,
  actions,
  labels: labelOverrides,
  className,
  maxVisibleWorkItems = 5,
  media,
  workItemStatusOptions = DEFAULT_WORK_ITEM_STATUS_OPTIONS,
}: TrackerCardProps) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const progress = clampProgress(data.progress);
  const serverWorkItems = data.workItems ?? [];
  const priority = priorityBadge(data.priority);

  const showEdit = Boolean(actions?.onEdit);
  const showDelete = Boolean(actions?.onDelete);
  const showActions = showEdit || showDelete;

  const [isEditingWorkItems, setIsEditingWorkItems] = React.useState(false);
  const [committedWorkItems, setCommittedWorkItems] =
    React.useState<TrackerCardWorkItem[]>(serverWorkItems);
  const [newItemTitle, setNewItemTitle] = React.useState("");
  const [newItemDate, setNewItemDate] = React.useState<Date | undefined>(undefined);
  const [draftWorkItems, setDraftWorkItems] =
    React.useState<TrackerCardWorkItem[]>(serverWorkItems);
  const [createdWorkItemIds, setCreatedWorkItemIds] = React.useState<Set<string>>(
    () => new Set(),
  );
  const [updatedWorkItemIds, setUpdatedWorkItemIds] = React.useState<Set<string>>(
    () => new Set(),
  );
  const [deletedWorkItemIds, setDeletedWorkItemIds] = React.useState<Set<string>>(
    () => new Set(),
  );
  const [isSavingChanges, setIsSavingChanges] = React.useState(false);
  const [editingWorkItemId, setEditingWorkItemId] = React.useState<string | null>(
    null,
  );
  const [editItemTitle, setEditItemTitle] = React.useState("");
  const [editItemDate, setEditItemDate] = React.useState<Date | undefined>();
  const [deleteCandidate, setDeleteCandidate] = React.useState<{
    id: string;
    task: string;
  } | null>(null);

  const hasDraftChanges =
    createdWorkItemIds.size > 0 ||
    updatedWorkItemIds.size > 0 ||
    deletedWorkItemIds.size > 0;
  const hasPendingChanges = hasDraftChanges || editingWorkItemId !== null;
  const isWorkItemsEmpty =
    committedWorkItems.length === 0 && deletedWorkItemIds.size === 0;
  const workItemsEditMode =
    isEditingWorkItems ||
    (Boolean(actions?.onSaveWorkItems) && isWorkItemsEmpty);
  const workItems = workItemsEditMode
    ? hasDraftChanges
      ? draftWorkItems
      : committedWorkItems
    : committedWorkItems;
  const canChangeWorkItemStatus = Boolean(
    workItemsEditMode &&
      (actions?.onSaveWorkItems || actions?.onWorkItemStatusChange),
  );
  const showWorkItemsDoneButton =
    workItemsEditMode &&
    (isWorkItemsEmpty
      ? newItemTitle.trim().length > 0 || hasDraftChanges
      : true);

  const enterWorkItemEditMode = () => {
    setDraftWorkItems(committedWorkItems);
    setIsEditingWorkItems(true);
  };

  const beginDraft = () => {
    if (!hasDraftChanges) setDraftWorkItems(committedWorkItems);
  };

  const handleCreateItem = () => {
    const task = newItemTitle.trim();
    if (!task || !actions?.onSaveWorkItems) return;

    const draftId = `draft-${crypto.randomUUID()}`;
    const item: TrackerCardWorkItem = {
      id: draftId,
      task,
      count: 1,
      dueDate: newItemDate?.toISOString() ?? null,
      status: "TODO",
      completedAt: null,
    };
    setDraftWorkItems((current) => [
      ...(hasDraftChanges ? current : committedWorkItems),
      item,
    ]);
    setCreatedWorkItemIds((current) => new Set(current).add(draftId));
    setNewItemTitle("");
    setNewItemDate(undefined);
  };

  const markItemUpdated = (workItemId: string) => {
    if (createdWorkItemIds.has(workItemId)) return;
    setUpdatedWorkItemIds((current) => new Set(current).add(workItemId));
  };

  const handleUpdateItem = (item: TrackerCardWorkItem) => {
    const task = editItemTitle.trim();
    if (!task || !editingWorkItemId || !actions?.onSaveWorkItems) return;

    beginDraft();
    setDraftWorkItems((current) =>
      (hasDraftChanges ? current : committedWorkItems).map((draftItem) =>
        draftItem.id === editingWorkItemId
          ? {
              ...draftItem,
              task,
              dueDate: editItemDate?.toISOString() ?? null,
            }
          : draftItem,
      ),
    );
    markItemUpdated(item.id);
    setEditingWorkItemId(null);
  };

  const handleDraftStatusChange = (
    workItemId: string,
    status: string,
    index: number,
  ) => {
    if (!actions?.onSaveWorkItems) {
      actions?.onWorkItemStatusChange?.(workItemId, status, data.id, index);
      return;
    }

    beginDraft();
    setDraftWorkItems((current) =>
      (hasDraftChanges ? current : committedWorkItems).map((item) =>
        item.id === workItemId ? { ...item, status } : item,
      ),
    );
    markItemUpdated(workItemId);
  };

  const handleDeleteItem = () => {
    if (!deleteCandidate || !actions?.onSaveWorkItems) return;

    beginDraft();
    setDraftWorkItems((current) =>
      (hasDraftChanges ? current : committedWorkItems).filter(
        (item) => item.id !== deleteCandidate.id,
      ),
    );
    if (createdWorkItemIds.has(deleteCandidate.id)) {
      setCreatedWorkItemIds((current) => {
        const next = new Set(current);
        next.delete(deleteCandidate.id);
        return next;
      });
    } else {
      setDeletedWorkItemIds((current) =>
        new Set(current).add(deleteCandidate.id),
      );
      setUpdatedWorkItemIds((current) => {
        const next = new Set(current);
        next.delete(deleteCandidate.id);
        return next;
      });
    }
    setDeleteCandidate(null);
    if (editingWorkItemId === deleteCandidate.id) {
      setEditingWorkItemId(null);
    }
  };

  const toDate = (value: string | null | undefined) => {
    if (!value) return undefined;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
  };

  const handleSaveChanges = async () => {
    if (isSavingChanges || !actions?.onSaveWorkItems) {
      return;
    }
    if (!hasPendingChanges) {
      setIsEditingWorkItems(false);
      return;
    }
    if (editingWorkItemId && !editItemTitle.trim()) return;

    const itemsToSave = editingWorkItemId
      ? (hasDraftChanges ? draftWorkItems : committedWorkItems).map((item) =>
          item.id === editingWorkItemId
            ? {
                ...item,
                task: editItemTitle.trim(),
                dueDate: editItemDate?.toISOString() ?? null,
              }
            : item,
        )
      : draftWorkItems;
    const updatedIdsToSave = new Set(updatedWorkItemIds);
    if (
      editingWorkItemId &&
      !createdWorkItemIds.has(editingWorkItemId)
    ) {
      updatedIdsToSave.add(editingWorkItemId);
    }

    setIsSavingChanges(true);
    try {
      const saved = await actions.onSaveWorkItems({
        trackerId: data.id,
        created: itemsToSave
          .filter((item) => createdWorkItemIds.has(item.id))
          .map((item) => ({
            task: item.task,
            count: item.count ?? 1,
            dueDate: toDate(item.dueDate),
            workItemStatus: item.status ?? "TODO",
          })),
        updated: itemsToSave
          .filter((item) => updatedIdsToSave.has(item.id))
          .map((item) => ({
            workItemId: item.id,
            task: item.task,
            count: item.count ?? 1,
            dueDate: toDate(item.dueDate),
            workItemStatus: item.status ?? "TODO",
          })),
        deletedWorkItemIds: [...deletedWorkItemIds],
      });
      if (saved === false) return;

      if (Array.isArray(saved)) {
        setCommittedWorkItems(saved);
      }
      setCreatedWorkItemIds(new Set());
      setUpdatedWorkItemIds(new Set());
      setDeletedWorkItemIds(new Set());
      setEditingWorkItemId(null);
      setIsEditingWorkItems(false);
    } finally {
      setIsSavingChanges(false);
    }
  };

  const handleDiscardChanges = () => {
    setDraftWorkItems(committedWorkItems);
    setCreatedWorkItemIds(new Set());
    setUpdatedWorkItemIds(new Set());
    setDeletedWorkItemIds(new Set());
    setEditingWorkItemId(null);
    setDeleteCandidate(null);
    setIsEditingWorkItems(false);
  };

  const startEditingItem = (
    item: TrackerCardWorkItem,
    workItemId: string,
  ) => {
    const dueDate = item.dueDate ? new Date(item.dueDate) : undefined;
    setEditingWorkItemId(workItemId);
    setEditItemTitle(item.task);
    setEditItemDate(
      dueDate && !Number.isNaN(dueDate.getTime()) ? dueDate : undefined,
    );
  };

  return (
    <Card
      className={cn(
        "group relative w-full overflow-hidden border border-border/80 bg-card/90 shadow-sm ring-1 ring-foreground/5",
        "transition-all duration-200 hover:border-primary/35 hover:shadow-md hover:shadow-primary/10",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-accent/[0.04] opacity-80"
        aria-hidden
      />

      <CardContent className="relative space-y-4 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium tabular-nums",
                  priority.tone,
                )}
              >
                <span aria-hidden>{priority.emoji}</span>
                {data.priority ?? 0}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <h3 className="min-w-0 flex-1 text-balance text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl">
                {data.title}
              </h3>
              {showActions ? (
                <div className="flex shrink-0 items-center gap-0.5">
                  {showEdit ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="text-muted-foreground hover:text-foreground"
                      aria-label={labels.edit}
                      title={labels.edit}
                      onClick={() => actions?.onEdit?.(data.id)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                  ) : null}
                  {showDelete ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="text-muted-foreground hover:text-destructive"
                      aria-label={labels.delete}
                      title={labels.delete}
                      onClick={() => actions?.onDelete?.(data.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>
            {data.description ? (
              <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {data.description}
              </p>
            ) : null}
          </div>

          {media ? (
            <div className="flex shrink-0 flex-col items-end gap-2">
              <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/30 p-1">
                {media}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-2 rounded-xl border border-border/60 bg-muted/15 p-3">
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>Progress</span>
            <span className="tabular-nums font-medium text-foreground">
              {progress}%
            </span>
          </div>
          <CustomProgress value={progress} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-foreground">
              {labels.workItemsTitle}
            </p>
            {actions?.onSaveWorkItems && showWorkItemsDoneButton ? (
              <Button
                type="button"
                variant="default"
                size="sm"
                disabled={
                  isSavingChanges ||
                  Boolean(editingWorkItemId && !editItemTitle.trim())
                }
                onClick={() => void handleSaveChanges()}
              >
                {isSavingChanges ? (
                  <LoaderCircle className="size-3.5 animate-spin" />
                ) : (
                  <Check className="size-3.5" />
                )}
                {isSavingChanges ? labels.savingChanges : labels.done}
              </Button>
            ) : null}
            {actions?.onSaveWorkItems && !workItemsEditMode ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSavingChanges}
                onClick={enterWorkItemEditMode}
              >
                <Pencil className="size-3.5" />
                {labels.edit}
              </Button>
            ) : null}
          </div>

          {workItemsEditMode ? (
            <div
              className="flex items-center gap-1.5 rounded-xl border border-primary/70 bg-background/85 p-2 shadow-[0_0_16px_color-mix(in_oklch,var(--primary)_25%,transparent)] ring-1 ring-primary/20"
              dir="rtl"
            >
              <Input
                autoFocus
                placeholder={labels.placeholder}
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                disabled={isSavingChanges}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateItem();
                  }
                }}
                className="h-8 min-w-0 flex-1 border-0 bg-transparent px-2 text-sm shadow-none focus-visible:ring-0"
              />
              <DatePicker
                date={newItemDate}
                onSelect={setNewItemDate}
              />
              <Button
                type="button"
                size="icon-xs"
                className="size-8 rounded-lg shadow-sm"
                onClick={handleCreateItem}
                disabled={!newItemTitle.trim() || isSavingChanges}
                aria-label={labels.addWorkItem}
                title={labels.addWorkItem}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          ) : null}

          <div
            className={cn(
              "overflow-hidden rounded-xl border border-border/60 bg-background/40",
              workItems.length > 0 && "divide-y divide-border/50",
            )}
          >
            {workItems.length === 0 && !workItemsEditMode ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                {labels.noWorkItems}
              </p>
            ) : workItems.length === 0 ? null : (
              <ul
                className={cn(
                  "max-h-[calc(var(--tracker-work-item-height,2.75rem)*var(--tracker-visible-items,5))]",
                  workItems.length > maxVisibleWorkItems && "overflow-y-auto",
                )}
                style={
                  {
                    "--tracker-visible-items": maxVisibleWorkItems,
                  } as CSSProperties
                }
              >
                {workItems.map((item, index) => {
                  const rowId = item.id || `${data.id}-work-item-${index}`;
                  const isDone = Boolean(item.completedAt);
                  const canToggle = Boolean(actions?.onToggleWorkItemComplete);
                  const isEditing = editingWorkItemId === rowId;

                  if (isEditing) {
                    return (
                      <li
                        key={rowId}
                        className="flex items-center gap-1.5 bg-primary/[0.04] p-2"
                        dir="rtl"
                      >
                        <Input
                          autoFocus
                          value={editItemTitle}
                          onChange={(event) =>
                            setEditItemTitle(event.target.value)
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              handleUpdateItem(item);
                            }
                            if (event.key === "Escape") {
                              setEditingWorkItemId(null);
                            }
                          }}
                          disabled={isSavingChanges}
                          className="h-8 min-w-0 flex-1 text-sm"
                        />
                        <DatePicker
                          date={editItemDate}
                          onSelect={setEditItemDate}
                        />
                        <Button
                          type="button"
                          size="icon-xs"
                          className="size-8"
                          disabled={!editItemTitle.trim() || isSavingChanges}
                          aria-label={labels.saveWorkItem}
                          title={labels.saveWorkItem}
                          onClick={() => handleUpdateItem(item)}
                        >
                          <Check className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className="size-8"
                          disabled={isSavingChanges}
                          aria-label={labels.cancel}
                          title={labels.cancel}
                          onClick={() => setEditingWorkItemId(null)}
                        >
                          <X className="size-4" />
                        </Button>
                      </li>
                    );
                  }

                  return (
                    <li
                      key={rowId}
                      className="flex flex-wrap items-center gap-x-2 gap-y-1.5 px-3 py-2.5 text-sm sm:flex-nowrap"
                    >
                      <span className="min-w-0 flex-1 truncate font-medium">
                        {item.task}
                      </span>
                      <span className="shrink-0 tabular-nums text-xs text-muted-foreground">
                        {item.count ?? 0}
                      </span>
                      <WorkItemStatusSelect
                        instanceId={`${data.id}-${rowId}`}
                        value={item.status}
                        disabled={item.statusChangePending}
                        options={workItemStatusOptions}
                        onChange={
                          canChangeWorkItemStatus
                            ? (status) =>
                                handleDraftStatusChange(rowId, status, index)
                            : undefined
                        }
                        readOnly={!canChangeWorkItemStatus}
                      />
                      {actions?.onSaveWorkItems && workItemsEditMode ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className="shrink-0 text-muted-foreground hover:text-foreground"
                          disabled={item.statusChangePending}
                          aria-label={labels.edit}
                          title={labels.edit}
                          onClick={() => startEditingItem(item, rowId)}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                      ) : null}
                      {actions?.onSaveWorkItems && workItemsEditMode ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className="shrink-0 text-muted-foreground hover:text-destructive"
                          disabled={item.statusChangePending}
                          aria-label={labels.deleteWorkItem}
                          title={labels.deleteWorkItem}
                          onClick={() =>
                            setDeleteCandidate({ id: rowId, task: item.task })
                          }
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      ) : null}
                      {canToggle ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className={cn(
                            "shrink-0",
                            isDone && "text-success hover:text-success",
                          )}
                          aria-label={labels.toggleWorkItem}
                          title={labels.toggleWorkItem}
                          onClick={() =>
                            actions?.onToggleWorkItemComplete?.(
                              rowId,
                              !isDone,
                            )
                          }
                        >
                          {isDone ? (
                            <CheckCircle2 className="size-4" />
                          ) : (
                            <Circle className="size-4 text-muted-foreground" />
                          )}
                        </Button>
                      ) : (
                        <span className="flex size-7 items-center justify-center">
                          {isDone ? (
                            <CheckCircle2 className="size-4 text-success" />
                          ) : (
                            <Circle className="size-4 text-muted-foreground/70" />
                          )}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {workItemsEditMode && !isWorkItemsEmpty ? (
            <div className="flex items-center justify-between gap-2 rounded-xl border border-primary/30 bg-primary/[0.05] p-2">
              <span className="px-1 text-xs text-muted-foreground">
                {hasPendingChanges
                  ? labels.unsavedChanges
                  : labels.addWorkItem}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isSavingChanges}
                onClick={handleDiscardChanges}
              >
                {labels.discardChanges}
              </Button>
            </div>
          ) : null}
        </div>
      </CardContent>

      <AlertDialog
        open={deleteCandidate !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteCandidate(null);
        }}
      >
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>{labels.deleteWorkItemTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {labels.deleteWorkItemDescription}
              {deleteCandidate?.task ? ` «${deleteCandidate.task}»` : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {labels.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteItem}
            >
              <Trash2 className="size-4" />
              {labels.deleteWorkItem}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}