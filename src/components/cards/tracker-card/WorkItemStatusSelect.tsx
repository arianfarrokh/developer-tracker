"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  DEFAULT_WORK_ITEM_STATUS_OPTIONS,
  getTrackerStatusClass,
  getTrackerStatusDotClass,
  mergeWorkItemStatusOptions,
  trackerStatusBadgeClass,
  workItemStatusSelectTriggerClassName,
  type TrackerStatusOption,
} from "./status";

type WorkItemStatusSelectProps = {
  value?: string;
  disabled?: boolean;
  options?: TrackerStatusOption[];
  onChange?: (status: string) => void;
  readOnly?: boolean;
  /** Unique id per row — prevents multiple selects from sharing state */
  instanceId: string;
};

export function WorkItemStatusSelect({
  value,
  disabled = false,
  options = DEFAULT_WORK_ITEM_STATUS_OPTIONS,
  onChange,
  readOnly = false,
  instanceId,
}: WorkItemStatusSelectProps) {
  const current = (value ?? "TODO").toUpperCase();
  const mergedOptions = mergeWorkItemStatusOptions(current, options);
  const selectedLabel =
    mergedOptions.find((option) => option.value === current)?.label ??
    current.replaceAll("_", " ");

  if (readOnly || !onChange) {
    return (
      <span className={cn(trackerStatusBadgeClass(current), "max-w-[7.25rem]")}>
        {selectedLabel}
      </span>
    );
  }

  return (
    <Select
      value={current}
      name={`work-item-status-${instanceId}`}
      disabled={disabled}
      onValueChange={(next) => {
        if (next != null && typeof next === "string") {
          onChange(next);
        }
      }}
    >
      <SelectTrigger
        size="sm"
        aria-label="Work item status"
        className={cn(
          workItemStatusSelectTriggerClassName,
          getTrackerStatusClass(current),
        )}
      >
        <SelectValue>{selectedLabel}</SelectValue>
      </SelectTrigger>

      <SelectContent
        className="min-w-[9.5rem] border-border/80 bg-popover text-popover-foreground"
        align="end"
        sideOffset={4}
      >
        {mergedOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="text-xs focus:bg-muted/80 focus:text-foreground data-highlighted:bg-muted/80 data-highlighted:text-foreground"
          >
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  getTrackerStatusDotClass(option.value),
                )}
                aria-hidden
              />
              {option.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
