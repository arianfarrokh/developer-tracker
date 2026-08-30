type AllProjectsQueryResultType = {
  id: ID;
  name: string;
  description: string;
  color: string;
  progress: number;
  isPinned: boolean;
  projectStatus: ProjectStatusEnum;
  progressMode: ProgressModeEnum;
  tecknologies: string[];
};

type CreateProjectVaribleType = {
  isSuccess: boolean;
};

type createProjectInputType = {
  color: string;
  description: string;
  isPinned: boolean;
  name: string;
  progress: number;
  progressMode: ProgressModeEnum;
  projectStatus: ProjectStatusEnum;
  tecknologies: string[];
};
