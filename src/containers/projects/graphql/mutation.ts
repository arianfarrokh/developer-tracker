import {
  InputIdVariable,
  InputVariable,
  ResultData,
} from "@/graphql/query-types";
import { gql, TypedDocumentNode } from "@apollo/client";

export const createProjectMutation: TypedDocumentNode<
  ResultData<ResultSucessType>,
  InputVariable<createProjectInputType>
> = gql`
  mutation createProject($input: CreateProjectInput!) {
    result: createProject(input: $input) {
      result {
        isSuccess
      }
      errors {
        ... on AppError {
          message
        }
      }
    }
  }
`;

export const updateProjectMutation: TypedDocumentNode<
  ResultData<ResultSucessType>,
  InputVariable<updateProjectType>
> = gql`
  mutation updateProject($input: UpdateProjectInput!) {
    respone: updateProject(input: $input) {
      result {
        isSuccess
      }
      errors {
        ... on AppError {
          message
        }
      }
    }
  }
`;

export const deleteProjectMutation: TypedDocumentNode<
  ResultData<ResultSucessType>,
  InputIdVariable
> = gql`
  mutation deleteProject($input: DeleteProjectInput!) {
    response: deleteProject(input: $input) {
      result {
        isSuccess
      }
      errors {
        ... on AppError {
          message
        }
      }
    }
  }
`;
