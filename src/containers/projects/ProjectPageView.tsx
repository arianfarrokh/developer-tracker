"use client";

import { useState } from "react";
import MainCard from "@/components/cards/MainCard";
import { useQuery } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { FolderKanban, PlusIcon } from "lucide-react";
import { AddProjectDialog } from "@/containers/projects/ui/AddProjectDialog/CustomDialog";
import { AllProjectsQueryResult } from "./graphql/query";
import { LoadingProjects } from "./ui/AddProjectDialog/LoadingProjects";

export default function ProjectsPageView() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, loading } = useQuery(AllProjectsQueryResult);

  const projects = data?.result ?? [];

  if (loading) {
    return <LoadingProjects />;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <FolderKanban className="size-5" aria-hidden />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              داشبورد
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            پروژه‌های من
          </h1>
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

      {projects.length === 0 ? (
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
              با ایجاد پروژه، کارت‌های پیشرفت، تکنولوژی‌ها و وضعیت کارها اینجا
              نمایش داده می‌شوند.
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
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <MainCard
              key={project.id}
              title={project.name}
              description={project.description}
              progress={project.progress}
              active={project.projectStatus}
              technologies={project.tecknologies}
              color={project.color}
              isPinned={project.isPinned}
            />
          ))}
        </div>
      )}

      <AddProjectDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
