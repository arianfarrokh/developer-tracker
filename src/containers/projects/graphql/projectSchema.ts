import * as Yup from "yup";


export const projectSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("نام پروژه الزامی است"),

  description: Yup.string()
    .trim()
    .required("توضیحات پروژه الزامی است"),

  color: Yup.string().required("رنگ پروژه را انتخاب کنید"),

  tecknologies: Yup.array()
    .of(Yup.string().trim().min(1))
    .min(1, "حداقل یک تکنولوژی وارد کنید")
    .required("حداقل یک تکنولوژی وارد کنید"),

  progress: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null
        ? undefined
        : Number(originalValue),
    )
    .min(0, "حداقل پیشرفت صفر است")
    .max(100, "حداکثر پیشرفت ۱۰۰ است")
    .required("درصد پیشرفت الزامی است"),

  progressMode: Yup.string()
    .oneOf(["AUTOMATIC", "MANUAL"])
    .required(),

  projectStatus: Yup.string()
    .oneOf(["ACTIVE", "ARCHIVED", "DONE", "PAUSED", "PLANNING"])
    .required(),

  isPinned: Yup.boolean().required(),
});

