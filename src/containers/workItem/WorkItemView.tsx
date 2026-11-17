"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { WorkItemStatusSelect } from "@/components/cards/tracker-card/WorkItemStatusSelect";
import {
  formatTrackerStatus,
  trackerStatusBadgeClass,
} from "@/components/cards/tracker-card/status";
import { CustomInputWithLabel } from "@/components/input/CustomInputWithLable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { updateWorkItemsMutation } from "@/containers/goals/graphql/mutation";
import { normalizeWorkItemStatus } from "@/containers/goals/workItemStatusApi";
import { cn } from "@/lib/utils";
import { useAlert } from "@/providers/alert-provider";
import { useMutation, useQuery } from "@apollo/client/react";
import { useFormik } from "formik";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ListTodo,
  Pencil,
} from "lucide-react";
import DetailRow from "./ui/DetailRow";
import {
  formatDisplayDate,
  fromDateInputValue,
  toDateInputValue,
} from "./constant";
import { workItemByIdQuery } from "./graphql/query";
import { mapWorkItemToViewData } from "./mapWorkItemToViewData";
import type { WorkItemFormValues, WorkItemViewData } from "./types";

export type { WorkItemViewData } from "./types";

export type WorkItemViewProps = {
  goalId: string;
  workItemId: string;
};

const EMPTY_ITEM: WorkItemViewData = {
  goalTitle: "",
  task: "",
  description: null,
  workItemStatus: "TODO",
  dueDate: null,
  completedAt: null,
};

function toFormValues(data: WorkItemViewData): WorkItemFormValues {
  return {
    goalTitle: data.goalTitle,
    task: data.task,
    description: data.description ?? "",
    workItemStatus: data.workItemStatus,
    dueDate: data.dueDate,
    completedAt: data.completedAt,
  };
}

function fromFormValues(values: WorkItemFormValues): WorkItemViewData {
  return {
    goalTitle: values.goalTitle,
    task: values.task,
    description: values.description.trim() ? values.description : null,
    workItemStatus: normalizeWorkItemStatus(values.workItemStatus),
    dueDate: values.dueDate,
    completedAt: values.completedAt,
  };
}

export default function WorkItemView({
  goalId,
  workItemId,
}: WorkItemViewProps) {
  const { success, error: showError } = useAlert();
  const [savedItem, setSavedItem] = useState<WorkItemViewData>(EMPTY_ITEM);
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: queryData,
    loading,
    error: queryError,
    refetch,
  } = useQuery(workItemByIdQuery, {
    variables: { id: workItemId },
    fetchPolicy: "no-cache",
  });

  const [updateWorkItems] = useMutation(updateWorkItemsMutation);

  const workItem = queryData?.workItemById;
  const mutationGoalId = workItem?.goal.id ?? goalId;

  const mappedFromQuery = useMemo(
    () => (workItem ? mapWorkItemToViewData(workItem) : null),
    [workItem],
  );

  useEffect(() => {
    if (!isEditing && mappedFromQuery) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSavedItem(mappedFromQuery);
    }
  }, [mappedFromQuery, isEditing]);

  const formik = useFormik<WorkItemFormValues>({
    initialValues: toFormValues(savedItem),
    enableReinitialize: true,
    onSubmit: async (values, helpers) => {
      if (!workItem) {
        showError("خطا", ["کار یافت نشد."]);
        helpers.setSubmitting(false);
        return;
      }

      const next = fromFormValues(values);

      try {
        const { data } = await updateWorkItems({
          variables: {
            input: {
              goalId: mutationGoalId,
              workItems: [
                {
                  id: workItem.id,
                  task: next.task.trim(),
                  description: next.description,
                  goalId: mutationGoalId,
                  count: workItem.count,
                  dueDate: next.dueDate,
                  workItemStatus: next.workItemStatus as WorkItemStatusEnum,
                },
              ],
            },
          },
        });

        const payload = data?.updateWorkItems;
        const updated = payload?.result?.[0];

        if (payload?.errors?.length || !updated) {
          throw new Error(
            payload?.errors?.[0]?.message ?? "به‌روزرسانی ناموفق بود.",
          );
        }

        const refreshed = mapWorkItemToViewData({
          ...workItem,
          task: updated.task,
          description: updated.description,
          dueDate: updated.dueDate,
          completedAt: updated.completedAt,
          workItemStatus: updated.workItemStatus as WorkItemStatusEnum,
          count: updated.count,
        });

        setSavedItem(refreshed);
        setIsEditing(false);
        await refetch();
        success("موفق", ["کار با موفقیت ذخیره شد."]);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "ذخیره کار ناموفق بود.";
        showError("خطا", [message]);
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const startEditing = () => {
    void formik.setValues(toFormValues(savedItem));
    setIsEditing(true);
  };

  const cancelEditing = () => {
    formik.resetForm({ values: toFormValues(savedItem) });
    setIsEditing(false);
  };

  const statusKey = savedItem.workItemStatus.toUpperCase();
  const backHref = "/goals";
  const hasTask = Boolean(savedItem.task.trim());

  if (loading && !workItem) {
    return (
      <div className="w-full px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:px-10">
        در حال بارگذاری...
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="w-full space-y-4 px-4 py-8 sm:px-6 lg:px-10">
        <p className="text-sm text-destructive">
          بارگذاری کار با خطا مواجه شد.
        </p>
        <Link href={backHref} className="text-sm text-muted-foreground hover:text-foreground">
          بازگشت به اهداف
        </Link>
      </div>
    );
  }

  if (!workItem) {
    return (
      <div className="w-full space-y-4 px-4 py-8 sm:px-6 lg:px-10">
        <p className="text-sm text-muted-foreground">کار یافت نشد.</p>
        <Link href={backHref} className="text-sm text-muted-foreground hover:text-foreground">
          بازگشت به اهداف
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={formik.handleSubmit}
      noValidate
      className="w-full space-y-8 px-4 py-8 sm:px-6 lg:px-10"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowRight className="size-4" aria-hidden />
          بازگشت به اهداف
        </Link>
        {!isEditing ? (
          <Button type="button" variant="outline" size="sm" onClick={startEditing}>
            <Pencil className="size-4" aria-hidden />
            ویرایش
          </Button>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={cancelEditing}
              disabled={formik.isSubmitting}
            >
              انصراف
            </Button>
            <Button type="submit" size="sm" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "در حال ذخیره..." : "ذخیره"}
            </Button>
          </div>
        )}
      </div>

      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          هدف: {savedItem.goalTitle.trim() || "—"}
        </p>
        {isEditing ? (
          <div className="space-y-4">
            <CustomInputWithLabel
              id="work-item-task"
              name="task"
              label="عنوان کار"
              value={formik.values.task}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="عنوان کار"
              error={
                formik.touched.task && formik.errors.task
                  ? formik.errors.task
                  : undefined
              }
            />
            <div className="flex flex-wrap items-center gap-2">
              <Label className="text-xs text-muted-foreground">وضعیت</Label>
              <WorkItemStatusSelect
                instanceId="work-item-detail"
                value={formik.values.workItemStatus}
                onChange={(status) => {
                  void formik.setFieldValue("workItemStatus", status);
                }}
              />
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {hasTask ? savedItem.task : "—"}
            </h1>
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                trackerStatusBadgeClass(statusKey),
              )}
            >
              {formatTrackerStatus(statusKey)}
            </span>
          </>
        )}
      </header>

      <Card className="border-border/80 bg-card/90 shadow-sm">
        {!isEditing ? (
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base font-medium">توضیحات</CardTitle>
          </CardHeader>
        ) : null}
        <CardContent className={isEditing ? "pt-6" : "pt-4"}>
          {isEditing ? (
            <CustomInputWithLabel
              id="work-item-description"
              name="description"
              label="توضیحات"
              multiline
              rows={5}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="توضیحات (اختیاری)"
              error={
                formik.touched.description && formik.errors.description
                  ? formik.errors.description
                  : undefined
              }
            />
          ) : savedItem.description?.trim() ? (
            <p className="whitespace-pre-wrap text-pretty text-sm leading-relaxed text-muted-foreground">
              {savedItem.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">توضیحی ثبت نشده است.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {!isEditing ? (
          <>
            <DetailRow
              icon={<ListTodo className="size-4" />}
              label="وضعیت"
              value={formatTrackerStatus(statusKey)}
            />
            <DetailRow
              icon={<Calendar className="size-4" />}
              label="سررسید"
              value={formatDisplayDate(savedItem.dueDate)}
            />
            <DetailRow
              icon={<CheckCircle2 className="size-4" />}
              label="تاریخ تکمیل"
              value={formatDisplayDate(savedItem.completedAt)}
            />
          </>
        ) : (
          <div className="space-y-2 sm:col-span-2 lg:col-span-3">
            <CustomInputWithLabel
              id="work-item-due-date"
              name="dueDate"
              label="سررسید"
              type="date"
              value={toDateInputValue(formik.values.dueDate)}
              onChange={(event) => {
                void formik.setFieldValue(
                  "dueDate",
                  fromDateInputValue(event.target.value),
                );
              }}
              onBlur={formik.handleBlur}
              error={
                formik.touched.dueDate && formik.errors.dueDate
                  ? String(formik.errors.dueDate)
                  : undefined
              }
            />
            <p className="text-xs text-muted-foreground">
              تاریخ تکمیل: {formatDisplayDate(savedItem.completedAt)} (فقط نمایش)
            </p>
          </div>
        )}
      </div>
    </form>
  );
}