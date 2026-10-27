import { FolderKanban, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";

type Props = {
  setIsCreateModalOpen: Dispatch<SetStateAction<boolean>>;
};

export function EmptyProjectsState({setIsCreateModalOpen}: Props) {
  return (
    <div className="flex min-h-[44vh] flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border/80 bg-gradient-to-b from-muted/30 to-transparent px-6 py-14 text-center">
      <div
        className="flex size-14 items-center justify-center rounded-2xl border border-border/60 bg-card shadow-sm"
        aria-hidden
      >
        <FolderKanban className="size-7 text-muted-foreground" />
      </div>
      <div className="max-w-md space-y-2">
        <p className="text-lg font-medium text-foreground">
          هنوز پروژه‌ای نداری
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          با ایجاد پروژه، کارت‌های پیشرفت، تکنولوژی‌ها و وضعیت کارها اینجا نمایش
          داده می‌شوند.
        </p>
      </div>
      <Button
        onClick={() => setIsCreateModalOpen(true)}
        variant="secondary"
        className="gap-2"
      >
        <PlusIcon className="size-4" />
        ایجاد اولین پروژه
      </Button>
    </div>
  );
}
