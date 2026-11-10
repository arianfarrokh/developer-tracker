import { InputVariable } from "@/graphql/query-types";
import { gql, TypedDocumentNode } from "@apollo/client";

export const createGoalMutation: TypedDocumentNode<
  CreateGoalMutationData,
  InputVariable<CreateGoalInput>
> = gql`
  mutation createGoalMutation($input: CreateGoalInput!) {
    createGoal(input: $input) {
      result {
        id
        title
        description
        priority
        progress
        goalStatus
        workItems {
          id
          task
          goalId
          count
          dueDate
          workItemStatus
          completedAt
        }
      }
    }
  }
`;

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
