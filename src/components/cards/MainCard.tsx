import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TiPin, TiPinOutline } from "react-icons/ti";
import { CustomProgress } from "../progress/CustomProgress";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { colors } from "@/lib/color";
const brandPurple = colors.primary.DEFAULT;

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "فعال",
  PLANNING: "در حال برنامه‌ریزی",
  PAUSED: "متوقف‌شده",
  DONE: "تکمیل‌شده",
  ARCHIVED: "بایگانی",
};

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  PLANNING: "border-violet-500/30 bg-violet-500/10 text-violet-400",
  PAUSED: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  DONE: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  ARCHIVED: "border-muted-foreground/30 bg-muted/50 text-muted-foreground",
};

type MainCardProps = {
  id: string;
  technologies?: string[];
  title?: string;
  active?: string;
  description?: string;
  progress?: number;
  color?: string;
  isPinned?: boolean;
  onTogglePin?: (id: string) => void;
  handleEditProject: (id: string) => void;
};

export default function MainCard({
  id,
  technologies,
  title,
  active,
  description,
  progress = 0,
  color,
  onTogglePin,
  handleEditProject,
  isPinned = false,
}: MainCardProps) {
  const statusKey = active ?? "ACTIVE";
  const statusLabel = STATUS_LABELS[statusKey] ?? statusKey;
  const statusStyle =
    STATUS_STYLES[statusKey] ?? "border-primary/30 bg-primary/10 text-primary";

  return (
    <Card
      className={cn(
        "group relative w-full overflow-hidden border border-border/80 bg-card/80 shadow-sm transition-all duration-200",
        "hover:border-primary/40 hover:bg-card hover:shadow-md hover:shadow-primary/5",
      )}
      style={{
        borderInlineStartWidth: "4px",
        borderInlineStartColor: color ?? "var(--primary)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        aria-hidden
        style={{
          background: `linear-gradient(135deg, ${color ?? brandPurple}08 0%, transparent 55%)`,
        }}
      />

      <CardHeader className="relative gap-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <CardTitle className="truncate text-lg font-semibold leading-tight tracking-tight md:text-xl">
              {title ?? "بدون عنوان"}
            </CardTitle>
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {description ?? "—"}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onTogglePin?.(id)}
            aria-label={isPinned ? "برداشتن سنجاق پروژه" : "سنجاق کردن پروژه"}
            aria-pressed={isPinned}
            title={isPinned ? "برداشتن سنجاق" : "سنجاق کردن"}
            className={cn(
              "size-9 shrink-0",
              isPinned && "bg-primary/15 hover:bg-primary/20",
            )}
          >
            {isPinned ? (
              <TiPin
                className="size-4 shrink-0 transition-colors"
                style={{ color: brandPurple }}
                aria-hidden={false}
                title="سنجاق شده"
              />
            ) : (
              <TiPinOutline
                className="size-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground/70"
                aria-hidden
              />
            )}
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
              statusStyle,
            )}
          >
            {statusLabel}
          </span>

          <span className="text-xs tabular-nums text-muted-foreground">
            {Math.min(100, Math.max(0, progress))}٪
          </span>
        </div>

        <CustomProgress value={progress} />
      </CardHeader>

      <CardContent className="relative space-y-3 pt-0">
        <div className="h-px w-full bg-border/60" />

        <div className="flex min-h-[1.75rem] flex-wrap gap-1.5">
          {technologies?.length ? (
            technologies.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="max-w-full truncate border border-border/60 bg-muted/50 px-2 py-0.5 text-[0.7rem] font-normal text-foreground/90"
                dir="ltr"
              >
                {tech}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">
              تکنولوژی ثبت نشده
            </span>
          )}
        </div>
        <div className="flex items-center justify-end w-full">
          <div className=" flex items-center justify-start gap-2">
            <Button
              variant="default"
              className="border-primary/40 hover:bg-primary/10 hover:text-primary"
              onClick={() => handleEditProject(id)}
            >
              به‌روزرسانی
            </Button>
            <Button variant="destructive">حذف</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
