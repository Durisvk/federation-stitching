import waitOn from "wait-on";
import { ApolloServer } from "apollo-server";
import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway";

const supergraphSdl = new IntrospectAndCompose({
  subgraphs: [
    { name: "movie", url: "http://localhost:4001" },
    { name: "actor", url: "http://localhost:4002" },
    { name: "cast", url: "http://localhost:4003" },
  ],
});

const gateway = new ApolloGateway({
  supergraphSdl,
  // Experimental: Enabling this enables the query plan view in Playground.
  __exposeQueryPlanExperimental: true,
});

(async () => {
  await waitOn({
    resources: ["tcp:4001", "tcp:4002", "tcp:4003"],
  });

  const server = new ApolloServer({
    gateway,
  });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();
