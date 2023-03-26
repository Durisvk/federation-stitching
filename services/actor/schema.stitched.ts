import { makeExecutableSchema } from "@graphql-tools/schema";
import * as data from "./data";

export const typeDefs = /* GraphQL */ `
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

  type Actor {
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
    actor: (_: any, { id }: { id: string }) => {
      const result = data.getActor(id);
      console.log(result);
      return result;
    },
  },
  Mutation: {
    createActor: (_: any, { input }: any) => data.createActor(input),
  },
};
