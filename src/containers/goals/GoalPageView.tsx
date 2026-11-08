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
import { AllGoalsQueryResult } from "./graphql/query";
import { mapGoalToTrackerCard } from "./mapGoalToTrackerCard";
import { GoalHeader } from "./ui/GoalHeader";
import { GOAL_WORK_ITEM_STATUS_OPTIONS } from "./workItemStatusOptions";
import { isWorkItemStatusEnum } from "./workItemStatusApi";
import { workItemStatusStateKey } from "./workItemStatusState";

const SKELETON_COUNT = 6;
const SYNTHETIC_WORK_ITEM_ID = /-work-item-\d+$/;

export function GoalPageView() {
  const { error: showError } = useAlert();
  const { data, loading } = useQuery(AllGoalsQueryResult, {
    fetchPolicy: "no-cache",
  });
  const goals = data?.result ?? [];
  const [workItemStatusById, setWorkItemStatusById] = useState<
    Record<string, string>
  >({});
  const [pendingWorkItemKeys, setPendingWorkItemKeys] = useState<Set<string>>(
    () => new Set(),
  );

  const [changeWorkItemStatus] = useMutation(changeWorkItemStatusMutation);

  const findWorkItemStatus = useCallback(
    (goalId: string, workItemId: string): string | undefined => {
      const goal = goals.find((item) => item.id === goalId);
      const workItem = goal?.workItems.find((item) => item.id === workItemId);
      return workItem?.workItemStatus;
    },
    [goals],
  );

  const handleWorkItemStatusChange = useCallback(
    async (
      workItemId: string,
      status: WorkItemStatusEnum,
      goalId: string,
    ) => {
      if (SYNTHETIC_WORK_ITEM_ID.test(workItemId) || !workItemId) {
        showError("خطا", ["شناسه آیتم کاری معتبر نیست."]);
        return;
      }

      if (!isWorkItemStatusEnum(status)) {
        showError("خطا", ["وضعیت انتخاب‌شده معتبر نیست."]);
        return;
      }

      const stateKey = workItemStatusStateKey(goalId, workItemId);
      const previousStatus = findWorkItemStatus(goalId, workItemId);

      setWorkItemStatusById((prev) => ({ ...prev, [stateKey]: status }));
      setPendingWorkItemKeys((prev) => new Set(prev).add(stateKey));

      try {
        const { data: mutationData } = await changeWorkItemStatus({
          variables: {
            input: {
              id: workItemId,
              newStatus: status,
            },
          },
          refetchQueries: [{ query: AllGoalsQueryResult }],
        });

        const updated = mutationData?.updateWorkItemStatus?.workItemDto;
        if (!updated?.id) {
          throw new Error("Update failed");
        }

        setWorkItemStatusById((prev) => {
          const next = { ...prev };
          delete next[stateKey];
          return next;
        });
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
    [changeWorkItemStatus, findWorkItemStatus, showError],
  );

  const goalCards = useMemo(() => {
    return goals.map((goal): TrackerCardData => {
      const card = mapGoalToTrackerCard(goal);
      return {
        ...card,
        workItems: card.workItems?.map((item, index) => {
          const rowId = item.id || `${goal.id}-work-item-${index}`;
          const stateKey = workItemStatusStateKey(goal.id, rowId);
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
                onWorkItemStatusChange: (workItemId, status, goalId) => {
                  void handleWorkItemStatusChange(workItemId, status, goalId);
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
