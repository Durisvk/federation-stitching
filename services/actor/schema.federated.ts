import { buildSubgraphSchema } from "@apollo/federation";
import { gql } from "apollo-server";
import * as data from "./data";

export const typeDefs = gql`
  type Query {
    actors(ids: [ID!]): [Actor]
    actor(id: ID!): Actor
  }

  type Mutation {
    createActor(input: CreateActorInput!): Actor
  }

  input CreateActorInput {
    name: String
  }

  type Actor @key(fields: "id") {
    id: ID!
    name: String
  }
`;

export const resolvers = {
  Query: {
    actors: (_: any, { ids }: { ids?: string[] }) => {
      return ids
        ? data.getActors().filter(({ id }) => ids.includes(id))
        : data.getActors();
    },
    actor: (_: any, { id }: { id: string }) => data.getActor(id),
  },
  Mutation: {
    createActor: (_: any, { input }: any) => data.createActor(input),
  },

  Actor: {
    __resolveReference: (movie: data.Actor) => data.getActor(movie.id),
  },
};

export const schema = buildSubgraphSchema({
  typeDefs,
  resolvers,
});
