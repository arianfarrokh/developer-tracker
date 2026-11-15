"use client";

import { useFormik } from "formik";
import * as Yup from "yup";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CustomInputWithLabel } from "@/components/input/CustomInputWithLable";
import { useMutation } from "@apollo/client/react";
import { editGoalMutation } from "../graphql/mutation";
import { AllGoalsQueryResult } from "../graphql/query";
import { useAlert } from "@/providers/alert-provider";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goalId: string | null;
  initialValues: {
    title: string;
    description: string;
    priority: number;
  };
};

const validationSchema = Yup.object({
  title: Yup.string().required("عنوان هدف الزامی است"),
  description: Yup.string(),
  priority: Yup.number().required("انتخاب اولویت الزامی است").oneOf([1, 2, 3]),
});

export default function EditGoalDialog({
  open,
  onOpenChange,
  goalId,
  initialValues,
}: Props) {
  const { show } = useAlert();

  const [editGoal, { loading }] = useMutation(editGoalMutation, {
    fetchPolicy: "no-cache",
    refetchQueries: [AllGoalsQueryResult],
  });

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      title: initialValues.title,
      description: initialValues.description,
      priority: String(initialValues.priority),
    },

    validationSchema,

    onSubmit: async (values) => {
      if (!goalId) return;

      try {
        const { data } = await editGoal({
          variables: {
            input: {
              id: goalId,
              title: values.title,
              description: values.description,
              priority: Number(values.priority),
            },
          },
        });

        const payload = (
          data as unknown as
            | {
                updateGoal?: {
                  errors?: { message?: string | null }[] | null;
                  result?: unknown;
                } | null;
              }
            | undefined
        )?.updateGoal;
        const errors = payload?.errors;

        if (errors && errors.length > 0) {
          throw new Error(errors[0]?.message ?? "Update failed");
        }

        if (!payload?.result) {
          throw new Error("Update failed");
        }

        show({
          variant: "success",
          title: "هدف با موفقیت ویرایش شد",
          duration: 3000,
        });

        onOpenChange(false);
      } catch {
        show({
          variant: "error",
          title: "ویرایش هدف ناموفق بود",
          duration: 3000,
        });
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125" dir="rtl">
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <DialogTitle>ویرایش هدف</DialogTitle>
            <DialogDescription>
              اطلاعات هدف خود را به‌روزرسانی کنید.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-5">
            <CustomInputWithLabel
              id="title"
              name="title"
              label="عنوان هدف"
              placeholder="مثلاً یادگیری Next.js"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title ? formik.errors.title : undefined}
            />

            <CustomInputWithLabel
              id="description"
              name="description"
              label="توضیحات"
              placeholder="توضیح کوتاهی درباره هدف..."
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description
                  ? formik.errors.description
                  : undefined
              }
            />

            <div className="space-y-2">
              <Label>اولویت</Label>

              <Select
                value={formik.values.priority}
                onValueChange={(value) => {
                  void formik.setFieldValue("priority", value);
                  void formik.setFieldTouched("priority", true);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب اولویت" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="1">کم</SelectItem>
                  <SelectItem value="2">متوسط</SelectItem>
                  <SelectItem value="3">زیاد</SelectItem>
                </SelectContent>
              </Select>

              {formik.touched.priority && formik.errors.priority && (
                <p className="text-sm text-destructive">
                  {formik.errors.priority}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => onOpenChange(false)}
            >
              انصراف
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
