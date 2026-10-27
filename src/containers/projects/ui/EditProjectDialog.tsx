"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Pin, Save } from "lucide-react";
import { cn } from "@/lib/utils";

const PROJECT_COLORS = [
  "#8B5CF6",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
];

const selectClassName =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40";

/** Static sample data for layout preview — wire to real values when adding logic. */
const UI_PREVIEW = {
  name: "وب‌سایت فروشگاهی",
  description: "پیاده‌سازی فروشگاه با Next.js و اتصال به API.",
  color: "#8B5CF6",
  tecknologies: ["Next.js", "TypeScript", "GraphQL"],
  progress: "42",
  progressMode: "MANUAL",
  projectStatus: "ACTIVE",
  isPinned: true,
} as const;

type EditProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditProjectDialog({
  open,
  onOpenChange,
}: EditProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(90vh,720px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="space-y-2 border-b border-border/60 bg-muted/20 px-5 py-5 text-right sm:px-6">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            ویرایش پروژه
          </DialogTitle>
          <DialogDescription className="text-pretty leading-relaxed">
            اطلاعات پروژه را به‌روزرسانی کن و تغییرات را ذخیره کن.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-6">
            <section className="space-y-4 rounded-xl border border-border/60 bg-muted/15 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                اطلاعات اصلی
              </p>
              <div className="space-y-2">
                <Label htmlFor="edit-project-name">نام پروژه</Label>
                <Input
                  id="edit-project-name"
                  name="name"
                  defaultValue={UI_PREVIEW.name}
                  placeholder="مثلاً وب‌سایت فروشگاهی"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-project-description">توضیحات</Label>
                <Textarea
                  id="edit-project-description"
                  name="description"
                  defaultValue={UI_PREVIEW.description}
                  placeholder="توضیح کوتاهی درباره پروژه..."
                  rows={3}
                  className="min-h-[5.5rem] resize-none"
                />
              </div>
            </section>

            <section className="space-y-3 rounded-xl border border-border/60 bg-muted/15 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                ظاهر کارت
              </p>
              <Label>رنگ پروژه</Label>
              <div className="flex flex-wrap items-center gap-2.5">
                {PROJECT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`انتخاب رنگ ${color}`}
                    aria-pressed={color === UI_PREVIEW.color}
                    className={cn(
                      "size-9 rounded-full border-2 shadow-sm transition-transform hover:scale-105",
                      color === UI_PREVIEW.color
                        ? "border-foreground ring-2 ring-ring/50 ring-offset-2 ring-offset-background"
                        : "border-transparent",
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}

                <label
                  className="relative flex size-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-border bg-background shadow-sm"
                  title="رنگ دلخواه"
                >
                  <input
                    type="color"
                    name="color"
                    defaultValue={UI_PREVIEW.color}
                    aria-label="انتخاب رنگ دلخواه"
                    className="absolute inset-0 size-full cursor-pointer border-0 bg-transparent opacity-0"
                  />
                  <span
                    className="size-6 rounded-full border border-border/60"
                    style={{ backgroundColor: UI_PREVIEW.color }}
                  />
                </label>
              </div>
            </section>

            <section className="space-y-3 rounded-xl border border-border/60 bg-muted/15 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                تکنولوژی‌ها
              </p>
              <Label htmlFor="edit-technology-input" className="sr-only">
                تکنولوژی‌ها
              </Label>

              <div className="flex gap-2">
                <Input
                  id="edit-technology-input"
                  placeholder="مثلاً Next.js"
                  dir="ltr"
                  className="text-left"
                />

                <Button type="button" variant="secondary" className="shrink-0">
                  افزودن
                </Button>
              </div>

              <div className="min-h-[2.5rem] rounded-lg border border-dashed border-border/70 p-2">
                <div className="flex flex-wrap gap-2">
                  {UI_PREVIEW.tecknologies.map((technology) => (
                    <span
                      key={technology}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background px-3 py-1 text-sm shadow-sm"
                      dir="ltr"
                    >
                      {technology}
                      <button
                        type="button"
                        aria-label={`حذف ${technology}`}
                        className="rounded-full px-0.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-4 rounded-xl border border-border/60 bg-muted/15 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                پیشرفت و وضعیت
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-project-progress">درصد پیشرفت</Label>
                  <div className="relative">
                    <Input
                      id="edit-project-progress"
                      name="progress"
                      type="number"
                      min={0}
                      max={100}
                      defaultValue={UI_PREVIEW.progress}
                      className="pe-9"
                    />
                    <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      %
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-progress-mode">حالت پیشرفت</Label>
                  <select
                    id="edit-progress-mode"
                    name="progressMode"
                    defaultValue={UI_PREVIEW.progressMode}
                    className={selectClassName}
                  >
                    <option value="AUTOMATIC">خودکار</option>
                    <option value="MANUAL">دستی</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-project-status">وضعیت پروژه</Label>
                <select
                  id="edit-project-status"
                  name="projectStatus"
                  defaultValue={UI_PREVIEW.projectStatus}
                  className={selectClassName}
                >
                  <option value="ACTIVE">فعال</option>
                  <option value="PLANNING">در حال برنامه‌ریزی</option>
                  <option value="PAUSED">متوقف‌شده</option>
                  <option value="DONE">تکمیل‌شده</option>
                  <option value="ARCHIVED">بایگانی</option>
                </select>
              </div>

              <label
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                  UI_PREVIEW.isPinned
                    ? "border-primary/40 bg-primary/5"
                    : "border-border hover:bg-muted/40",
                )}
              >
                <input
                  type="checkbox"
                  name="isPinned"
                  defaultChecked={UI_PREVIEW.isPinned}
                  className="size-4 accent-primary"
                />
                <div className="flex flex-1 items-center gap-2">
                  <Pin
                    className={cn(
                      "size-4",
                      UI_PREVIEW.isPinned
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  />
                  <span className="text-sm font-medium">سنجاق کردن پروژه</span>
                </div>
              </label>
            </section>
          </div>

          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border/60 bg-muted/20 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="sm:min-w-[6.5rem]"
            >
              انصراف
            </Button>
            <Button type="button" className="gap-2 sm:min-w-[10rem]">
              <Save className="size-4" />
              ذخیره تغییرات
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
