"use client";

import React from "react";
import { ApolloLink } from "@apollo/client";
import {
  ApolloClient,
  InMemoryCache,
  ApolloNextAppProvider,
} from "@apollo/client-integration-nextjs";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";
import { SetContextLink } from "@apollo/client/link/context";
import { createAuthExpiryRedirectLink } from "./lib/apollo-auth-expired-link";
import { authContext } from "./context/context";

function makeClient() {
  const apiUri = process.env.API_URI ?? "";
  const webSocketUri = process.env.WEB_SOCKET_URI ?? "";

  const wsLink =
    typeof window !== "undefined"
      ? new GraphQLWsLink(
          createClient({
            url: webSocketUri,
          })
        )
      : null;

  const httpLink = new UploadHttpLink({
    uri: apiUri,
    headers: {
      "GraphQL-Preflight": "1",
    },
  });

  const authLink = new SetContextLink((prevContext) => {
    const token = authContext()?.token;
    return {
      headers: {
        ...prevContext.headers,
        authorization: token ? `Bearer ${token}` : "",
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
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
