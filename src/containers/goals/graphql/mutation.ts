import { InputVariable } from "@/graphql/query-types";
import { gql, TypedDocumentNode } from "@apollo/client";

export const changeWorkItemStatusMutation: TypedDocumentNode<
  ChangeWorkItemStatusMutationData,
  InputVariable<UpdateWorkItemStatusInput>
> = gql`
  mutation updateWorkItemStatus($input: UpdateWorkItemStatusInput!) {
    updateWorkItemStatus(input: $input) {
      result {
        id
        task
        count
        dueDate
        completedAt
        workItemStatus
        goalId
      }
      errors {
        ... on AppError {
          message
        }
      }
    }
  }
`;
