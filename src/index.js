import { ApolloServer, PubSub } from "apollo-server";
import mongoose from "mongoose";

import typeDefs from "./graphql/schema";
import Config from "../config";
import resolvers from "./graphql/resolvers/index";

const { MONGODB } = Config;
const pubsub = new PubSub();
const PORT = process.env.PORT || 5000;
//a context can accept an object directly or a function that returns an object
//we use a function when we want to perform some logic.
//context: ({req})=>({req})
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

//connect to db
mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("db connected");
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`server running on ${res.url}`);
  })
  .catch((error) => {
    console.error(error);
  });
