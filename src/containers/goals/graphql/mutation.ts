import { InputVariable, ResultData } from "@/graphql/query-types";
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
          description
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

export const createWorkItemsMutation: TypedDocumentNode<
  CreateWorkItemsMutationData,
  InputVariable<CreateWorkItemsInput>
> = gql`
  mutation createWorkItemsMutation($input: CreateWorkItemsInput!) {
    createWorkItems(input: $input) {
      result {
        id
        task
        description
        goalId
        count
        dueDate
        completedAt
        workItemStatus
      }
      errors {
        ... on AppError {
          message
        }
      }
    }
  }
`;

export const updateWorkItemsMutation: TypedDocumentNode<
  UpdateWorkItemsMutationData,
  InputVariable<UpdateWorkItemsInput>
> = gql`
  mutation updateWorkItemsMutation($input: UpdateWorkItemsInput!) {
    updateWorkItems(input: $input) {
      result {
        id
        task
        description
        goalId
        count
        dueDate
        completedAt
        workItemStatus
      }
      errors {
        ... on AppError {
          message
        }
      }
    }
  }
`;

export const deleteWorkItemsMutation: TypedDocumentNode<
  DeleteWorkItemsMutationData,
  InputVariable<DeleteWorkItemsInput>
> = gql`
  mutation deleteWorkItemsMutation($input: DeleteWorkItemsInput!) {
    deleteWorkItems(input: $input) {
      result
      errors {
        ... on AppError {
          message
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
        description
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

export const deleteGoalMutation: TypedDocumentNode<
  ResultData<{ isSuccess: boolean }>,
  InputVariable<{ id: string }>
> = gql`
  mutation deleteGoalMutation($input: DeleteGoalInput!) {
    response: deleteGoal(input: $input) {
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

export const editGoalMutation: TypedDocumentNode<
  CreateGoalMutationData,
  InputVariable<UpdateGoalInput>
> = gql`
  mutation updateGoalMutation($input: UpdateGoalInput!) {
    updateGoal(input: $input) {
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
          description
          count
          dueDate
          workItemStatus
          completedAt
        }
      }
      errors {
        ... on AppError {
          message
        }
      }
    }
  }
`;
