import { ApolloServer } from "apollo-server";
import { schema } from "./schema.federated";

const server = new ApolloServer({
  schema,
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
