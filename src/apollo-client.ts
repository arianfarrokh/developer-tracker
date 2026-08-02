import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { SetContextLink } from "@apollo/client/link/context";
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";
import { createAuthExpiryRedirectLink } from "./lib/apollo-auth-expired-link";

export function createApolloClient() {
  const apiUri = process.env.API_URI ?? "";
  const webSocketUri = process.env.WEB_SOCKET_URI ?? "";

  const wsLink =
    typeof window !== "undefined"
      ? new GraphQLWsLink(
          createClient({
            url: webSocketUri,
            connectionParams: () => ({
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            }),
          })
        )
      : null;

  const httpLink = new UploadHttpLink({
    uri: apiUri,
    headers: {
      // "GraphQL-Preflight": "1",
    },
  });

  const authLink = new SetContextLink((prevContext) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return {
      headers: {
        ...prevContext.headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const authExpiredRedirectLink = createAuthExpiryRedirectLink();
  const httpChain = authLink.concat(httpLink);

  const link =
    typeof window !== "undefined" && wsLink != null
      ? authExpiredRedirectLink.concat(
          ApolloLink.split(
            ({ query }) => {
              const def = getMainDefinition(query);
              return (
                def.kind === "OperationDefinition" &&
                def.operation === "subscription"
              );
            },
            wsLink,
            httpChain,
          ),
        )
      : authExpiredRedirectLink.concat(httpChain);

  return new ApolloClient({
    cache: new InMemoryCache(),
    link,
    ssrMode: typeof window === "undefined",
  });
}

// ایجاد نمونه کلاینت
const client = createApolloClient();

// اضافه کردن getClient برای سازگاری
export const getClient = () => client;

export const apolloClient = client;
