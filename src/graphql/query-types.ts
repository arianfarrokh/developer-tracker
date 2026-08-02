import { GraphQLCursorOrderClause } from "@/hooks/useGraphQLCursorPaginationQuery";
import { GridPaginationModel } from "@mui/x-data-grid";

export interface MutationError {
  code: string;
  message: string;
}


export interface ResultData<T> {
  response: {
    result?: T | null;
    errors?: MutationError[] | null;
  };
}

export interface SingleData<T> {
  result: T;
}

export type SortType = "ASC" | "DESC";

/**
 * GraphQL input `RegisterDateOrder` when sent as **Apollo variables** (JSON).
 * Use `"DESC"` / `"ASC"` strings — the server maps them to GraphQL enum values.
 * Unquoted `DESC` exists only in `.graphql` query text, not in TypeScript objects.
 */
export type RegisterDateOrder = {
  registerDate: SortType;
};

export type QueryFilter = {
  contains?: string;
  ncontains?: string;
  startsWith?: string;
  nstartsWith?: string;
  endsWith?: string;
  eq?: string | number | boolean | Date;
  neq?: string | number | boolean | Date;
  gt?: number | Date;
  ngt?: number | Date;
  gte?: number | Date;
  ngte?: number | Date;
  lt?: number | Date;
  nlt?: number | Date;
  lte?: number | Date;
  nlte?: number | Date;
};

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}
export interface PaginationQuery {
  totalCount: number;
  pageInfo: PageInfo;
}
export interface AllPaginationQuery<QueryType> extends PaginationQuery {
  nodes?: QueryType[];
}

export interface PaginationVariable {
  first?: number | null;
  last?: number | null;
  before?: string | null;
  after?: string | null;
  /** GraphQL variable; enums are serialized as strings in JSON, e.g. `"DESC"` for `DESC`. */
  order?: GraphQLCursorOrderClause[] | null;
  where?: unknown | null;
}
export interface AllRowQuery<QueryType> {
  result: AllPaginationQuery<QueryType>;
}
export interface AllRowQueryNoPaginate<QueryType> {
  result: QueryType[];
}

export type RefetchQueryModel<TVariable> = {
  variable: TVariable;
  paginationModel: GridPaginationModel;
};
const pageSize = 10;

export const initPageinationVariable: PaginationVariable = {
  before: null,
  after: null,
  first: null,
  last: null,
};
export const initPaginationModel = {
  page: 0,
  pageSize,
};

export interface IdVariable {
  id: ID;
}
export interface InputIdVariable {
  input: {
    id: ID;
  };
}
export interface InputVariable<TVariable> {
  input: TVariable;
}
