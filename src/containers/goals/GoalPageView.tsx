"use client";

import {
  TrackerCard,
  TrackerCardSkeleton,
  type TrackerCardData,
} from "@/components/cards/tracker-card";
import { useQuery } from "@apollo/client/react";
import { useCallback, useMemo, useState } from "react";
import { AllGoalsQueryResult } from "./graphql/query";
import { mapGoalToTrackerCard } from "./mapGoalToTrackerCard";
import { GoalHeader } from "./ui/GoalHeader";
import { GOAL_WORK_ITEM_STATUS_OPTIONS } from "./workItemStatusOptions";

const SKELETON_COUNT = 6;

export function GoalPageView() {
  const { data, loading } = useQuery(AllGoalsQueryResult, {
    fetchPolicy: "no-cache",
  });
  const goals = data?.result ?? [];
  const [workItemStatusById, setWorkItemStatusById] = useState<
    Record<string, string>
  >({});

  const handleWorkItemStatusChange = useCallback(
    (workItemId: string, status: string) => {
      setWorkItemStatusById((prev) => ({ ...prev, [workItemId]: status }));
      // TODO: call updateWorkItem mutation when available
    },
    [],
  );

  const goalCards = useMemo(() => {
    return goals.map((goal): TrackerCardData => {
      const card = mapGoalToTrackerCard(goal);
      return {
        ...card,
        workItems: card.workItems?.map((item) => ({
          ...item,
          status: workItemStatusById[item.id] ?? item.status,
        })),
      };
    });
  }, [goals, workItemStatusById]);

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
                onWorkItemStatusChange: (workItemId, status) =>
                  handleWorkItemStatusChange(workItemId, status),
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
