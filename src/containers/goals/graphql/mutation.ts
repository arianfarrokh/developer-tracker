import { InputVariable } from "@/graphql/query-types";
import { gql, TypedDocumentNode } from "@apollo/client";

export const changeWorkItemStatusMutation: TypedDocumentNode<
  ChangeWorkItemStatusMutationData,
  InputVariable<UpdateWorkItemStatusInput>
> = gql`
  mutation changeWorkItemStatus($input: UpdateWorkItemStatusInput!) {
    updateWorkItemStatus(input: $input) {
      workItemDto {
        id
        task
        goalId
        dueDate
        completedAt
        workItemStatus
      }
    }
  }
`;
