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
import { Plus, Pin } from "lucide-react";
import { createProjectMutation } from "../../graphql/mutation";
import { useMutation } from "@apollo/client/react";
import { useFormik } from "formik";
import { projectSchema } from "../../graphql/projectSchema";
import { useState } from "react";
import { useAlert } from "@/providers/alert-provider";
import { cn } from "@/lib/utils";
import { AllProjectsQueryResult } from "../../graphql/query";

const initialValues: createProjectInputType = {
  name: "",
  description: "",
  color: "#8B5CF6",
  tecknologies: [],
  progress: 0,
  progressMode: "AUTOMATIC",
  projectStatus: "ACTIVE",
  isPinned: false,
};

type CreateProjectModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const colors = [
  "#8B5CF6",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
];

const selectClassName =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40";

export function AddProjectDialog({
  open,
  onOpenChange,
}: CreateProjectModalProps) {
  const [technologyInput, setTechnologyInput] = useState("");

  const { success, error: showError } = useAlert();

  const [createProject, { loading }] = useMutation(createProjectMutation);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: projectSchema,
    onSubmit: async (values, helpers) => {
      try {
        await createProject({
          variables: {
            input: {
              color: values.color,
              description: values.description,
              isPinned: values.isPinned,
              name: values.name,
              progress: values.progress,
              progressMode: values.progressMode,
              projectStatus: values.projectStatus,
              tecknologies: values.tecknologies,
            },
          },
          refetchQueries: [{ query: AllProjectsQueryResult }],
        });

        helpers.resetForm();
        setTechnologyInput("");
        onOpenChange(false);
        success("موفق", ["پروژه با موفقیت ایجاد شد."]);
      } catch {
        showError("خطا", ["ایجاد پروژه ناموفق بود. دوباره تلاش کنید."]);
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const handleAddTechnology = () => {
    const technology = technologyInput.trim();

    if (!technology) return;

    const alreadyExists = formik.values.tecknologies.some(
      (item) => item.toLowerCase() === technology.toLowerCase(),
    );

    if (alreadyExists) return;

    formik.setFieldValue("tecknologies", [
      ...formik.values.tecknologies,
      technology,
    ]);
  };

  const handleRemoveTechnology = (technology: string) => {
    formik.setFieldValue(
      "tecknologies",
      formik.values.tecknologies.filter((item) => item !== technology),
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[min(90vh,720px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl"
      >
        <DialogHeader className="space-y-2 border-b border-border/60 bg-muted/20 px-5 py-5 text-right sm:px-6">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            افزودن پروژه جدید
          </DialogTitle>
          <DialogDescription className="text-pretty leading-relaxed">
            اطلاعات پروژه‌ات رو وارد کن و فضای کارت رو بساز.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-6">
            <section className="space-y-4 rounded-xl border border-border/60 bg-muted/15 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                اطلاعات اصلی
              </p>

              <div className="space-y-2">
                <Label htmlFor="project-name">نام پروژه</Label>
                <Input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id="name"
                  name="name"
                  value={formik.values.name}
                  placeholder="مثلاً وب‌سایت فروشگاهی"
                  className={
                    formik.touched.name && formik.errors.name
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />

                {formik.touched.name && formik.errors.name && (
                  <p className="text-sm text-destructive">
                    {formik.errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-description">توضیحات</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="توضیح کوتاهی درباره پروژه..."
                  rows={3}
                  className="min-h-[5.5rem] resize-none"
                />

                {formik.touched.description && formik.errors.description && (
                  <p className="text-sm text-destructive">
                    {formik.errors.description}
                  </p>
                )}
              </div>
            </section>

            <section className="space-y-3 rounded-xl border border-border/60 bg-muted/15 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                ظاهر کارت
              </p>
              <Label>رنگ پروژه</Label>
              <div className="flex flex-wrap items-center gap-2.5">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => formik.setFieldValue("color", color)}
                    aria-label={`انتخاب رنگ ${color}`}
                    aria-pressed={formik.values.color === color}
                    className={cn(
                      "size-9 rounded-full border-2 shadow-sm transition-transform hover:scale-105",
                      formik.values.color === color
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
                    value={formik.values.color}
                    onChange={formik.handleChange}
                    aria-label="انتخاب رنگ دلخواه"
                    className="absolute inset-0 size-full cursor-pointer border-0 bg-transparent opacity-0"
                  />
                  <span
                    className="size-6 rounded-full border border-border/60"
                    style={{ backgroundColor: formik.values.color }}
                  />
                </label>
              </div>
            </section>

            <section className="space-y-3 rounded-xl border border-border/60 bg-muted/15 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                تکنولوژی‌ها
              </p>
              <Label htmlFor="technology-input" className="sr-only">
                تکنولوژی‌ها
              </Label>

              <div className="flex gap-2">
                <Input
                  id="technology-input"
                  value={technologyInput}
                  onChange={(event) => setTechnologyInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddTechnology();
                    }
                  }}
                  placeholder="مثلاً Next.js"
                  dir="ltr"
                  className="text-left"
                />

                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddTechnology}
                  disabled={!technologyInput.trim()}
                  className="shrink-0"
                >
                  افزودن
                </Button>
              </div>

              {formik.submitCount > 0 && formik.errors.tecknologies && (
                <p className="text-sm text-destructive">
                  {formik.errors.tecknologies}
                </p>
              )}

              <div
                className={cn(
                  "min-h-[2.5rem] rounded-lg border border-dashed border-border/70 p-2",
                  formik.values.tecknologies.length === 0 &&
                    "flex items-center justify-center",
                )}
              >
                {formik.values.tecknologies.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    هنوز تکنولوژی اضافه نکردی
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {formik.values.tecknologies.map((technology) => (
                      <span
                        key={technology}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background px-3 py-1 text-sm shadow-sm"
                        dir="ltr"
                      >
                        {technology}

                        <button
                          type="button"
                          onClick={() => handleRemoveTechnology(technology)}
                          aria-label={`حذف ${technology}`}
                          className="rounded-full px-0.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-4 rounded-xl border border-border/60 bg-muted/15 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                پیشرفت و وضعیت
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="project-progress">درصد پیشرفت</Label>
                  <div className="relative">
                    <Input
                      id="progress"
                      name="progress"
                      onChange={formik.handleChange}
                      value={formik.values.progress}
                      type="number"
                      min={0}
                      max={100}
                      className="pe-9"
                    />
                    <span
                      className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                    >
                      %
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="progress-mode">حالت پیشرفت</Label>
                  <select
                    id="progressMode"
                    name="progressMode"
                    value={formik.values.progressMode}
                    onChange={formik.handleChange}
                    className={selectClassName}
                  >
                    <option value="AUTOMATIC">خودکار</option>
                    <option value="MANUAL">دستی</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-status">وضعیت پروژه</Label>
                <select
                  id="projectStatus"
                  name="projectStatus"
                  value={formik.values.projectStatus}
                  onChange={formik.handleChange}
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
                  formik.values.isPinned
                    ? "border-primary/40 bg-primary/5"
                    : "border-border hover:bg-muted/40",
                )}
              >
                <input
                  type="checkbox"
                  name="isPinned"
                  checked={formik.values.isPinned}
                  onChange={formik.handleChange}
                  className="size-4 accent-primary"
                />
                <div className="flex flex-1 items-center gap-2">
                  <Pin
                    className={cn(
                      "size-4",
                      formik.values.isPinned
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  />
                  <span className="text-sm font-medium">سنجاق کردن پروژه</span>
                </div>
              </label>
            </section>
          </div>

          <div
            className="flex shrink-0 flex-col-reverse gap-2 border-t border-border/60 bg-muted/20 px-5 py-4 sm:flex-row sm:justify-end sm:px-6"
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="sm:min-w-[6.5rem]"
            >
              انصراف
            </Button>
            <Button
              type="submit"
              className="gap-2 sm:min-w-[10rem]"
              disabled={loading || formik.isSubmitting}
            >
              <Plus className="size-4" />
              {loading ? "در حال ایجاد پروژه..." : "ایجاد پروژه"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
