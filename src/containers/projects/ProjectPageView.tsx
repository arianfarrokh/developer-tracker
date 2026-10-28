"use client";

import { useState } from "react";
import MainCard from "@/components/cards/MainCard";
import { useMutation, useQuery } from "@apollo/client/react";
import { AddProjectDialog } from "@/containers/projects/ui/CustomDialog";
import { AllProjectsQueryResult } from "./graphql/query";
import { LoadingProjects } from "./ui/LoadingProjects";
import { EmptyProjectsState } from "./ui/EmptyProjectsState";
import ProjectHeader from "./ui/ProjectHeader";
import { updateProjectMutation } from "./graphql/mutation";
import { EditProjectDialog } from "./ui/EditProjectDialog";
import { DeleteProjectDialog } from "./ui/DeleteProjectDialog";

export default function ProjectsPageView() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProject, setEditingProject] =
    useState<AllProjectsQueryResultType | null>(null);
  const [deletingProject, setDeletingProject] = useState<{id: string, name: string} | null>(null);

  const { data, loading } = useQuery(AllProjectsQueryResult);
  const projects = data?.result ?? [];

  const sortedProjects = [...projects].sort(
    (a, b) => Number(b.isPinned) - Number(a.isPinned),
  );

  const [updateProject, { loading: UpdateLoading }] = useMutation(
    updateProjectMutation,
  );

  const handleTogglePin = async (id: string) => {
    const project = sortedProjects.find((item) => item.id === id);
    if (!project) return;

    await updateProject({
      variables: {
        input: {
          id: project.id,
          name: project.name,
          description: project.description,
          color: project.color,
          progress: project.progress,
          isPinned: !project.isPinned,
          projectStatus: project.projectStatus,
          progressMode: project.progressMode,
          tecknologies: project.tecknologies,
        },
      },
      refetchQueries: [{ query: AllProjectsQueryResult }],
    });
  };

  if (loading || UpdateLoading) {
    return <LoadingProjects />;
  }

  return (
    <div className="space-y-8 px-10">
      <ProjectHeader
        projects={projects}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />

      {projects.length === 0 ? (
        <EmptyProjectsState setIsCreateModalOpen={setIsCreateModalOpen} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {sortedProjects.map((project) => (
            <MainCard
              key={project.id}
              name={project.name}
              id={project.id}
              title={project.name}
              description={project.description}
              progress={project.progress}
              active={project.projectStatus}
              technologies={project.tecknologies}
              color={project.color}
              isPinned={project.isPinned}
              onTogglePin={handleTogglePin}
              handleEditProject={(id) => {
                const projectToEdit = sortedProjects.find(
                  (item) => item.id === id,
                );
                if (!projectToEdit) return;
                setEditingProject(projectToEdit);
                setIsUpdateModalOpen(true);
              }}
              handleDeleteProject={(id, name) => {
                setDeletingProject({id, name});
                setIsDeleteModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {editingProject && (
        <EditProjectDialog
          open={isUpdateModalOpen}
          onOpenChange={(open) => {
            setIsUpdateModalOpen(open);
            if (!open) setEditingProject(null);
          }}
          project={editingProject}
        />
      )}

      <AddProjectDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      <DeleteProjectDialog
        id={deletingProject?.id ?? null}
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        name={deletingProject?.name ?? ""}
      />
    </div>
  );
}
