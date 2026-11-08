"use client";

import type { CSSProperties } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CustomProgress } from "@/components/progress/CustomProgress";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Circle,
  Copy,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import {
  DEFAULT_WORK_ITEM_STATUS_OPTIONS,
  priorityBadge,
  shortenDisplayId,
  trackerStatusBadgeClass,
  formatTrackerStatus,
} from "./status";
import type { TrackerCardProps } from "./types";
import { WorkItemStatusSelect } from "./WorkItemStatusSelect";

const DEFAULT_LABELS = {
  workItemsTitle: "Work Items",
  noWorkItems: "No work items",
  addWorkItem: "Add work item",
  duplicate: "Duplicate",
  edit: "Edit",
  delete: "Delete",
  toggleWorkItem: "Toggle complete",
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
  const workItems = data.workItems ?? [];
  const priority = priorityBadge(data.priority);
  const canChangeWorkItemStatus = Boolean(actions?.onWorkItemStatusChange);

  const showDuplicate = Boolean(actions?.onDuplicate);
  const showEdit = Boolean(actions?.onEdit);
  const showDelete = Boolean(actions?.onDelete);
  const showActions = showDuplicate || showEdit || showDelete;

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
          <span className="font-mono text-[11px] text-muted-foreground">
            {shortenDisplayId(data.id)}
          </span>

          {showActions ? (
            <div className="flex items-center gap-0.5">
              {showDuplicate ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={labels.duplicate}
                  title={labels.duplicate}
                  onClick={() => actions?.onDuplicate?.(data.id)}
                >
                  <Copy className="size-3.5" />
                </Button>
              ) : null}
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
          ) : (
            <div className="size-7" aria-hidden />
          )}
        </div>

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

            <h3 className="text-balance text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl">
              {data.title}
            </h3>
            {data.description ? (
              <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {data.description}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            {media ? (
              <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/30 p-1">
                {media}
              </div>
            ) : null}
            <span className={trackerStatusBadgeClass(data.status)}>
              {formatTrackerStatus(data.status)}
            </span>
          </div>
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
            {actions?.onAddWorkItem ? (
              <Button
                type="button"
                variant="outline"
                size="icon-xs"
                className="rounded-full border-border/70"
                aria-label={labels.addWorkItem}
                title={labels.addWorkItem}
                onClick={() => actions.onAddWorkItem?.(data.id)}
              >
                <Plus className="size-3.5" />
              </Button>
            ) : null}
          </div>

          <div
            className={cn(
              "overflow-hidden rounded-xl border border-border/60 bg-background/40",
              workItems.length > 0 && "divide-y divide-border/50",
            )}
          >
            {workItems.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                {labels.noWorkItems}
              </p>
            ) : (
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
                                actions?.onWorkItemStatusChange?.(
                                  rowId,
                                  status,
                                  data.id,
                                )
                            : undefined
                        }
                        readOnly={!canChangeWorkItemStatus}
                      />
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
        </div>
      </CardContent>
    </Card>
  );
}
