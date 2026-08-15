"use client";

import MainCard from "@/components/cards/MainCard";
import { MainCardSkeleton } from "@/components/cards/MainCardSkeleton";
import { useQuery } from "@apollo/client/react";
import { AllProjectsQueryResult } from "./graphql";

const SKELETON_COUNT = 6;

export default function ProjectsPage() {
  const { data, loading } = useQuery(AllProjectsQueryResult);

  const projects = data?.result ?? [];

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <MainCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/40 px-6 text-center">
        <p className="text-base font-medium text-foreground">پروژه ای یافت نشد.</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          پروژه های شما در اینجا ظاهر خواهند شد.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <MainCard
          key={project.id}
          title={project.name}
          description={project.description}
          progress={project.progress}
          active={project.projectStatus}
          technologies={project.tecknologies}
        />
      ))}
    </div>
  );
}
