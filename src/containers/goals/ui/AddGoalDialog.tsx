"use client";

import { CustomInputWithLabel } from "@/components/input/CustomInputWithLable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAlert } from "@/providers/alert-provider";
import { useMutation } from "@apollo/client/react";
import { useFormik } from "formik";
import { Plus } from "lucide-react";
import * as Yup from "yup";
import { createGoalMutation } from "../graphql/mutation";

type AddGoalDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => Promise<unknown>;
};

const initialValues: CreateGoalInput = {
  title: "",
  description: "",
  priority: 5,
};

const createGoalSchema = Yup.object({
  title: Yup.string().trim().required("عنوان هدف الزامی است."),
  description: Yup.string().trim().required("توضیحات هدف الزامی است."),
  priority: Yup.number()
    .min(1, "اولویت باید حداقل ۱ باشد.")
    .max(10, "اولویت باید حداکثر ۱۰ باشد.")
    .required("اولویت الزامی است."),
});

export function AddGoalDialog({
  open,
  onOpenChange,
  onCreated,
}: AddGoalDialogProps) {
  const { success, error: showError } = useAlert();
  const [createGoal, { loading }] = useMutation(createGoalMutation);

  const formik = useFormik<CreateGoalInput>({
    initialValues,
    validationSchema: createGoalSchema,
    onSubmit: async (values, helpers) => {
      try {
        const { data } = await createGoal({
          variables: {
            input: {
              title: values.title.trim(),
              description: values.description.trim(),
              priority: Number(values.priority),
            },
          },
        });

        if (!data?.createGoal?.result?.id) {
          throw new Error("Create goal returned no result");
        }

        await onCreated();
        helpers.resetForm();
        onOpenChange(false);
        success("موفق", ["هدف با موفقیت ایجاد شد."]);
      } catch {
        showError("خطا", ["ایجاد هدف ناموفق بود. دوباره تلاش کنید."]);
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !formik.isSubmitting) {
      formik.resetForm();
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[min(90vh,620px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="space-y-2 border-b border-border/60 bg-muted/20 px-5 py-5 text-right sm:px-6">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            افزودن هدف جدید
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            عنوان، توضیحات و میزان اولویت هدف را وارد کنید.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="space-y-5 px-5 py-5 sm:px-6">
            <CustomInputWithLabel
              id="goal-title"
              name="title"
              label="عنوان هدف"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="مثلاً یادگیری .NET"
              error={formik.touched.title ? formik.errors.title : undefined}
            />

            <CustomInputWithLabel
              id="goal-description"
              name="description"
              label="توضیحات"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="توضیح کوتاهی درباره هدف..."
              multiline
              rows={4}
              error={
                formik.touched.description
                  ? formik.errors.description
                  : undefined
              }
            />

            <div className="space-y-2">
              <Label htmlFor="goal-priority">اولویت</Label>
              <Input
                id="goal-priority"
                name="priority"
                type="number"
                min={1}
                max={10}
                value={formik.values.priority}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(
                  formik.touched.priority && formik.errors.priority,
                )}
              />
              {formik.touched.priority && formik.errors.priority ? (
                <p className="text-sm text-destructive">
                  {formik.errors.priority}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  عددی بین ۱ تا ۱۰
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-border/60 bg-muted/20 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
              className="sm:min-w-24"
            >
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={loading || formik.isSubmitting}
              className="gap-2 sm:min-w-36"
            >
              <Plus className="size-4" />
              {loading ? "در حال ایجاد..." : "ایجاد هدف"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
