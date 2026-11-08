import { SingleData } from "@/graphql/query-types";
import { gql, TypedDocumentNode } from "@apollo/client";

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
