import { InputVariable, ResultData } from "@/graphql/query-types";
import { gql, TypedDocumentNode } from "@apollo/client";

export const createProjectMutation: TypedDocumentNode<
  ResultData<createProjectInputType>,
  InputVariable<CreateProjectVaribleType>
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
