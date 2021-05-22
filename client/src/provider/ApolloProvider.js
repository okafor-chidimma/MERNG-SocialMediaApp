import React from "react";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { setContext } from "@apollo/client/link/context";
import App from "../routes/App";

const httpLink = createHttpLink({
  uri: "http://localhost:5000/",
});
//this line sets up the token so the app does not need to add it every time it needs to make a request
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("jwtToken");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

//by default apollo-client uses http client for to send graphql operations to the server
//cached value stores any in memory cache. what the cached values? apollo client saves all the return data from each query in the memory cache in a data normalization format meaning that it extracts object into their own table and replaces them with their id sort of like FK, PK situation. it only extracts these objects if we specifically returned id in our return object from the query sent in useQuery or useMutation.

/*
  if another query or mutation is sent and the return object matches a type as well as the id existing in cache, the apollo client just merges the incoming with the existing data. 

  if there are properties in the new object already existing in the obj stored in cache, it overwrites the properties while fields that exist in either new or existing are preserved
*/


//create the client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
//wrap your root app, if you are using react router, wrap your router application in apollo provider
export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
export const ApolloProviderComponent = () => {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
};

//the named export exposes the ApolloProviderComponent which wraps the apollo provider, so we get a component
//the default export exposes the apollo provider but not wrapped in a component
