import { SingleData } from "@/graphql/query-types";
import { gql, TypedDocumentNode } from "@apollo/client";

export const AllWorkItemsQueryResult: TypedDocumentNode<{
  allWorkItems: GoalWorkItemQueryResultType[];
}> = gql`
  query allWorkItemsQuery {
    allWorkItems {
      id
      task
      goalId
      count
      dueDate
      completedAt
      workItemStatus
    }
  }
`;

export const AllGoalsQueryResult: TypedDocumentNode<
  SingleData<AllGoalsQueryResultType[]>
> = gql`
  query allGoalsQuery {
    result: allGoalsQuery {
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
        completedAt
        workItemStatus
      }
    }
  }
`;
