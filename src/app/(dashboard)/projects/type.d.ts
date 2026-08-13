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
}