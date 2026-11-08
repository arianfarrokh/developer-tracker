import { Button } from "@/components/ui/button";
import { PlusIcon, Target } from "lucide-react";

type Props = {
  goalsCount: number;
  onAddGoal?: () => void;
};

export function GoalHeader({ goalsCount, onAddGoal }: Props) {
  return (
    <header className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-primary">
          <Target className="size-5" aria-hidden />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            داشبورد
          </span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">اهداف من</h1>
        <p className="text-sm text-muted-foreground">
          {goalsCount > 0
            ? `${goalsCount} هدف — پیشرفت و کارهای هر هدف را در کارت مربوطه پیگیری کنید.`
            : "اولین هدف خود را ایجاد کنید و پیگیری کارهایتان را آغاز کنید."}
        </p>
      </div>

      {onAddGoal ? (
        <Button
          type="button"
          onClick={onAddGoal}
          className="shrink-0 gap-2 shadow-sm"
        >
          <PlusIcon className="size-4" />
          افزودن هدف جدید
        </Button>
      ) : null}
    </header>
  );
}
