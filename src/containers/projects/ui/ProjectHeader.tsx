import { Button } from "@base-ui/react";
import { FolderKanban, PlusIcon } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  setIsCreateModalOpen: Dispatch<SetStateAction<boolean>>;
  projects: AllProjectsQueryResultType[]
};

export default function ProjectHeader({setIsCreateModalOpen, projects}: Props) {
  return (
    <header className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-primary">
          <FolderKanban className="size-5" aria-hidden />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            داشبورد
          </span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">پروژه‌های من</h1>
        <p className="text-sm text-muted-foreground">
          {projects.length > 0
            ? `${projects.length} پروژه — پیشرفت و وضعیت هر کارت را یکجا ببین.`
            : "اولین پروژه‌ات را بساز و کارها را منظم نگه دار."}
        </p>
      </div>

      <Button
        onClick={() => setIsCreateModalOpen(true)}
        className="shrink-0 gap-2 shadow-sm"
      >
        <PlusIcon className="size-4" />
        پروژه جدید
      </Button>
    </header>
  );
}
