"use client";

import {
  TrackerCard,
  TrackerCardSkeleton,
  type TrackerCardData,
} from "@/components/cards/tracker-card";
import { useAlert } from "@/providers/alert-provider";
import { useMutation, useQuery } from "@apollo/client/react";
import { useCallback, useMemo, useState } from "react";
import { changeWorkItemStatusMutation } from "./graphql/mutation";
import {
  AllGoalsQueryResult,
  AllWorkItemsQueryResult,
} from "./graphql/query";
import { mapGoalToTrackerCard } from "./mapGoalToTrackerCard";
import { mergeWorkItemIdsFromCatalog } from "./mergeWorkItemIdsFromCatalog";
import { GoalHeader } from "./ui/GoalHeader";
import { GOAL_WORK_ITEM_STATUS_OPTIONS } from "./workItemStatusOptions";
import {
  isUsableWorkItemId,
  isWorkItemStatusEnum,
  workItemRowId,
} from "./workItemStatusApi";
import { workItemStatusStateKey } from "./workItemStatusState";

const SKELETON_COUNT = 6;

export function GoalPageView() {
  const { error: showError } = useAlert();
  const {
    data: goalsData,
    loading: goalsLoading,
    refetch: refetchGoals,
  } = useQuery(
    AllGoalsQueryResult,
    { fetchPolicy: "no-cache" },
  );
  const {
    data: workItemsData,
    loading: workItemsLoading,
    refetch: refetchWorkItems,
  } = useQuery(AllWorkItemsQueryResult, { fetchPolicy: "no-cache" });
  const loading = goalsLoading || workItemsLoading;
  const goals = useMemo(
    () =>
      mergeWorkItemIdsFromCatalog(
        goalsData?.result ?? [],
        workItemsData?.allWorkItems ?? [],
      ),
    [goalsData?.result, workItemsData?.allWorkItems],
  );
  const [workItemStatusById, setWorkItemStatusById] = useState<
    Record<string, string>
  >({});
  const [pendingWorkItemKeys, setPendingWorkItemKeys] = useState<Set<string>>(
    () => new Set(),
  );

  const [changeWorkItemStatus] = useMutation(changeWorkItemStatusMutation);

  const findWorkItemStatus = useCallback(
    (goalId: string, workItemIndex: number): string | undefined => {
      return goals.find((item) => item.id === goalId)?.workItems[workItemIndex]
        ?.workItemStatus;
    },
    [goals],
  );

  const resolveMutationWorkItemId = useCallback(
    (goalId: string, workItemIndex: number, workItemId: string): string | null => {
      const fromQuery = goals.find((g) => g.id === goalId)?.workItems[workItemIndex]
        ?.id;
      if (isUsableWorkItemId(fromQuery)) return fromQuery;
      if (isUsableWorkItemId(workItemId)) return workItemId;
      return null;
    },
    [goals],
  );

  const handleWorkItemStatusChange = useCallback(
    async (
      workItemId: string,
      status: WorkItemStatusEnum,
      goalId: string,
      workItemIndex: number,
    ) => {
      const mutationId = resolveMutationWorkItemId(
        goalId,
        workItemIndex,
        workItemId,
      );
      if (!mutationId) {
        showError("خطا", ["شناسه آیتم کاری معتبر نیست."]);
        return;
      }

      if (!isWorkItemStatusEnum(status)) {
        showError("خطا", ["وضعیت انتخاب‌شده معتبر نیست."]);
        return;
      }

      const stateKey = workItemStatusStateKey(goalId, workItemIndex);
      const previousStatus = findWorkItemStatus(goalId, workItemIndex);

      setWorkItemStatusById((prev) => ({ ...prev, [stateKey]: status }));
      setPendingWorkItemKeys((prev) => new Set(prev).add(stateKey));

      try {
        const { data: mutationData } = await changeWorkItemStatus({
          variables: {
            input: {
              id: mutationId,
              newStatus: status,
            },
          },
        });

        const payload = mutationData?.updateWorkItemStatus;
        const errors = payload?.errors;
        if (errors && errors.length > 0) {
          throw new Error(errors[0]?.message ?? "Update failed");
        }

        const updated = payload?.result;
        if (!updated?.id) {
          throw new Error("Update failed");
        }

        const [, workItemsResult] = await Promise.all([
          refetchGoals(),
          refetchWorkItems(),
        ]);
        const catalogHasUpdatedStatus =
          workItemsResult.data?.allWorkItems.some(
            (item) =>
              item.id === mutationId && item.workItemStatus === status,
          ) ?? false;

        if (catalogHasUpdatedStatus) {
          setWorkItemStatusById((prev) => {
            const next = { ...prev };
            delete next[stateKey];
            return next;
          });
        }
      } catch {
        setWorkItemStatusById((prev) => {
          const next = { ...prev };
          if (previousStatus !== undefined) {
            next[stateKey] = previousStatus;
          } else {
            delete next[stateKey];
          }
          return next;
        });
        showError("خطا", ["به‌روزرسانی وضعیت آیتم کاری ناموفق بود."]);
      } finally {
        setPendingWorkItemKeys((prev) => {
          const next = new Set(prev);
          next.delete(stateKey);
          return next;
        });
      }
    },
    [
      changeWorkItemStatus,
      findWorkItemStatus,
      refetchGoals,
      refetchWorkItems,
      resolveMutationWorkItemId,
      showError,
    ],
  );

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
          const stateKey = workItemStatusStateKey(goal.id, index);
          return {
            ...item,
            id: rowId,
            status: workItemStatusById[stateKey] ?? item.status,
            statusChangePending: pendingWorkItemKeys.has(stateKey),
          };
        }),
      };
    });
  }, [goals, pendingWorkItemKeys, workItemStatusById]);

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

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-10">
      <GoalHeader
        goalsCount={goals.length}
        onAddGoal={() => {
          /* hook up create-goal dialog */
        }}
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
                onWorkItemStatusChange: (
                  workItemId,
                  status,
                  goalId,
                  workItemIndex,
                ) => {
                  void handleWorkItemStatusChange(
                    workItemId,
                    status as WorkItemStatusEnum,
                    goalId,
                    workItemIndex,
                  );
                },
              }}
              labels={{
                workItemsTitle: "آیتم‌های کاری",
                noWorkItems: "آیتمی ثبت نشده",
                addWorkItem: "افزودن آیتم",
                duplicate: "کپی",
                edit: "ویرایش",
                delete: "حذف",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
