import { SingleData } from "@/graphql/query-types";
import { gql, TypedDocumentNode } from "@apollo/client";

export const AllProjectsQueryResult: TypedDocumentNode<
  SingleData<AllProjectsQueryResultType[]>
> = gql`
  query allProjectsQuery {
    result: allProjects {
      id
      name
      description
      color
      progress
      isPinned
      projectStatus
      progressMode
      tecknologies
    }
  }
`;
