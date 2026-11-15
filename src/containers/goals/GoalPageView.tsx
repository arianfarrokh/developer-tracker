"use client";

import {
  TrackerCard,
  TrackerCardSkeleton,
  type SaveTrackerWorkItemsInput,
  type TrackerCardData,
  type TrackerCardWorkItem,
} from "@/components/cards/tracker-card";
import { useAlert } from "@/providers/alert-provider";
import { useMutation, useQuery } from "@apollo/client/react";
import { useCallback, useMemo, useState } from "react";
import {
  createWorkItemsMutation,
  deleteWorkItemsMutation,
  updateWorkItemsMutation,
} from "./graphql/mutation";
import { AllGoalsQueryResult, AllWorkItemsQueryResult } from "./graphql/query";
import { mapGoalToTrackerCard } from "./mapGoalToTrackerCard";
import { mergeWorkItemIdsFromCatalog } from "./mergeWorkItemIdsFromCatalog";
import { AddGoalDialog } from "./ui/AddGoalDialog";
import { GoalHeader } from "./ui/GoalHeader";
import { GOAL_WORK_ITEM_STATUS_OPTIONS } from "./workItemStatusOptions";
import {
  isUsableWorkItemId,
  isWorkItemStatusEnum,
  normalizeWorkItemStatus,
  workItemRowId,
} from "./workItemStatusApi";
import { DeleteGoalDialog } from "./ui/DeleteGoalDialog";
import EditGoalDialog from "./ui/EditGoalDialog";

const SKELETON_COUNT = 6;

export function GoalPageView() {
  const { show, error: showError } = useAlert();
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);
  const {
    data: goalsData,
    loading: goalsLoading,
    refetch: refetchGoals,
  } = useQuery(AllGoalsQueryResult, { fetchPolicy: "no-cache" });
  const {
    data: workItemsData,
    loading: workItemsLoading,
    refetch: refetchWorkItems,
  } = useQuery(AllWorkItemsQueryResult, { fetchPolicy: "no-cache" });
  const loading =
    (goalsLoading && !goalsData) || (workItemsLoading && !workItemsData);
  const goals = useMemo(
    () =>
      mergeWorkItemIdsFromCatalog(
        goalsData?.result ?? [],
        workItemsData?.allWorkItems ?? [],
      ),
    [goalsData?.result, workItemsData?.allWorkItems],
  );
  const [createWorkItems] = useMutation(createWorkItemsMutation);
  const [updateWorkItems] = useMutation(updateWorkItemsMutation);
  const [deleteWorkItems] = useMutation(deleteWorkItemsMutation);

  const handleSaveWorkItems = useCallback(
    async ({
      trackerId,
      created,
      updated,
      deletedWorkItemIds,
    }: SaveTrackerWorkItemsInput): Promise<
      boolean | TrackerCardWorkItem[]
    > => {
      const hasInvalidStatus = [...created, ...updated].some(
        (item) => !isWorkItemStatusEnum(item.workItemStatus),
      );
      const hasInvalidId =
        updated.some((item) => !isUsableWorkItemId(item.workItemId)) ||
        deletedWorkItemIds.some((id) => !isUsableWorkItemId(id));

      if (hasInvalidStatus || hasInvalidId) {
        showError("خطا", ["اطلاعات آیتم‌های کاری معتبر نیست."]);
        return false;
      }

      try {
        let createdResults: GoalWorkItemQueryResultType[] = [];
        let updatedResults: GoalWorkItemQueryResultType[] = [];

        if (created.length > 0) {
          const { data } = await createWorkItems({
            variables: {
              input: {
                goalId: trackerId,
                workItems: created.map((item) => ({
                  task: item.task,
                  count: item.count,
                  dueDate: item.dueDate?.toISOString() ?? null,
                  workItemStatus: item.workItemStatus as WorkItemStatusEnum,
                })),
              },
            },
          });
          const payload = data?.createWorkItems;
          if (
            payload?.errors?.length ||
            payload?.result?.length !== created.length
          ) {
            throw new Error(payload?.errors?.[0]?.message ?? "Create failed");
          }
          createdResults = payload.result;
        }

        if (updated.length > 0) {
          const { data } = await updateWorkItems({
            variables: {
              input: {
                goalId: trackerId,
                workItems: updated.map((item) => ({
                  id: item.workItemId,
                  task: item.task,
                  goalId: trackerId,
                  count: item.count,
                  dueDate: item.dueDate?.toISOString() ?? null,
                  workItemStatus: item.workItemStatus as WorkItemStatusEnum,
                })),
              },
            },
          });
          const payload = data?.updateWorkItems;
          const updatedIds = new Set(payload?.result?.map((item) => item.id));
          if (
            payload?.errors?.length ||
            updated.some((item) => !updatedIds.has(item.workItemId))
          ) {
            throw new Error(payload?.errors?.[0]?.message ?? "Update failed");
          }
          updatedResults = payload?.result ?? [];
        }

        if (deletedWorkItemIds.length > 0) {
          const { data } = await deleteWorkItems({
            variables: {
              input: {
                goalId: trackerId,
                workItemIds: deletedWorkItemIds,
              },
            },
          });
          const payload = data?.deleteWorkItems;
          if (payload?.errors?.length || payload?.result !== true) {
            throw new Error(payload?.errors?.[0]?.message ?? "Delete failed");
          }
        }

        const [, workItemsResult] = await Promise.all([
          refetchGoals(),
          refetchWorkItems(),
        ]);
        if (!workItemsResult.data) {
          throw new Error("Work item refresh returned no data");
        }
        const deletedIds = new Set(deletedWorkItemIds);
        const mutationResults = [...createdResults, ...updatedResults];
        const mutationResultById = new Map(
          mutationResults.map((item) => [item.id, item]),
        );
        const refreshedItems = workItemsResult.data.allWorkItems
          .filter(
            (item) =>
              item.goalId === trackerId && !deletedIds.has(item.id),
          )
          .map((item) => mutationResultById.get(item.id) ?? item);
        const refreshedIds = new Set(refreshedItems.map((item) => item.id));
        const authoritativeItems = [
          ...refreshedItems,
          ...mutationResults.filter(
            (item) =>
              item.goalId === trackerId &&
              !deletedIds.has(item.id) &&
              !refreshedIds.has(item.id),
          ),
        ];
        const savedItems = authoritativeItems
          .map(
            (item): TrackerCardWorkItem => ({
              id: item.id,
              task: item.task,
              count: item.count,
              dueDate: item.dueDate,
              completedAt: item.completedAt,
              status: normalizeWorkItemStatus(item.workItemStatus),
            }),
          );
        show({
          title: "موفق",
          description: ["تمام تغییرات آیتم‌های کاری ذخیره شد."],
          duration: 2000,
          variant: "success",
        });
        return savedItems;
      } catch {
        showError("خطا", [
          "ذخیره تغییرات آیتم‌های کاری ناموفق بود. دوباره تلاش کنید.",
        ]);
        return false;
      }
    },
    [
      createWorkItems,
      deleteWorkItems,
      refetchGoals,
      refetchWorkItems,
      show,
      showError,
      updateWorkItems,
    ],
  );

  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  const goalCards = useMemo(() => {
    return goals.map((goal): TrackerCardData => {
      const card = mapGoalToTrackerCard(goal);
      return {
        ...card,
        workItems: card.workItems?.map((item, index) => {
          const source = goal.workItems[index];
          const rowId = source
            ? workItemRowId(goal.id, source, index)
            : item.id || `${goal.id}-work-item-${index}`;
          return {
            ...item,
            id: rowId,
          };
        }),
      };
    });
  }, [goals]);

  const editingGoal = useMemo(
  () => goals.find((goal) => goal.id === editingGoalId),
  [goals, editingGoalId],
);

  if (loading) {
    return (
      <div className="space-y-8 px-4 sm:px-6 lg:px-10">
        <GoalHeader goalsCount={0} />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <TrackerCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  const handleDeleted = () => {
    setSelectedGoalId(null);
    void Promise.all([refetchGoals(), refetchWorkItems()]);
    show({
      title: "هدف با موفقست حذف گردید",
      duration: 2000,
      variant: "success",
    });
  };

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-10">
      <GoalHeader
        goalsCount={goals.length}
        onAddGoal={() => setIsCreateGoalOpen(true)}
      />

      {goals.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-12 text-center">
          <p className="text-lg font-medium">No goals yet</p>
          <p className="max-w-md text-sm text-muted-foreground">
            Goals from your API will appear here as cards with nested work
            items.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {goalCards.map((card) => (
            <TrackerCard
              key={card.id}
              data={card}
              workItemStatusOptions={GOAL_WORK_ITEM_STATUS_OPTIONS}
              actions={{
                onSaveWorkItems: handleSaveWorkItems,
                onEdit: (id) => setEditingGoalId(id),
                onDelete: (id) => setSelectedGoalId(id),
              }}
              labels={{
                workItemsTitle: "آیتم‌های کاری",
                noWorkItems: "آیتمی ثبت نشده",
                addWorkItem: "افزودن آیتم",
                placeholder: "عنوان آیتم کاری...",
                creatingWorkItem: "در حال ایجاد آیتم",
                saveWorkItem: "ذخیره تغییرات",
                updatingWorkItem: "در حال ویرایش آیتم",
                deleteWorkItem: "حذف آیتم",
                deletingWorkItem: "در حال حذف آیتم",
                deleteWorkItemTitle: "حذف آیتم کاری",
                deleteWorkItemDescription:
                  "آیا از حذف این آیتم کاری اطمینان دارید؟",
                cancel: "انصراف",
                done: "انجام شد",
                savingChanges: "در حال ذخیره...",
                discardChanges: "لغو تغییرات",
                unsavedChanges: "تغییرات ذخیره‌نشده",
                duplicate: "کپی",
                edit: "ویرایش",
                delete: "حذف",
              }}
            />
          ))}
        </div>
      )}

      <AddGoalDialog
        open={isCreateGoalOpen}
        onOpenChange={setIsCreateGoalOpen}
        onCreated={() => Promise.all([refetchGoals(), refetchWorkItems()])}
      />

      <DeleteGoalDialog
        open={selectedGoalId !== null}
        goalId={selectedGoalId}
        onOpenChange={(open) => {
          if (!open) setSelectedGoalId(null);
        }}
        onDeleted={handleDeleted}
      />

      <EditGoalDialog
        open={editingGoalId !== null}
        goalId={editingGoalId}
        onOpenChange={(open) => {
          if (!open) setEditingGoalId(null);
        }}
        initialValues={{
          title: editingGoal?.title ?? "",
          description: editingGoal?.description ?? "",
          priority: editingGoal?.priority ?? 2,
        }}
      />
    </div>
  );
}
