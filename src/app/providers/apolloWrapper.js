"use client";

import { useEffect } from "react";
import { ApolloProvider, useApolloClient } from "@apollo/client";
import client from "@/lib/apolloClient";
import { GET_TASKS } from "@/graphql/operations/taskOperations";
import { GET_TODOS } from "@/graphql/operations/todoOperations";

function WarmCache() {
  const apollo = useApolloClient();

  useEffect(() => {
    apollo.query({ query: GET_TASKS }).catch(() => {});
    apollo.query({ query: GET_TODOS }).catch(() => {});
  }, [apollo]);

  return null;
}

export default function ApolloWrapper({ children }) {
  return (
    <ApolloProvider client={client}>
      <WarmCache />
      {children}
    </ApolloProvider>
  );
}
