import { gql, TypedDocumentNode } from "@apollo/client";
import { WorkItemByIdQueryData } from "./type";

export const workItemByIdQuery: TypedDocumentNode<
  WorkItemByIdQueryData,
  { id: ID }
> = gql`
  query workItemById($id: UUID!) {
    workItemById(id: $id) {
      id
      task
      description
      dueDate
      completedAt
      workItemStatus
      count
      goal {
        id
        title
        progress
      }
    }
  }
`;