import { gql } from "apollo-server";
import * as data from "./data";

export const typeDefs = gql`
  type Cast {
    id: ID!
    actorId: ID!
    movieId: ID!
  }

  type Query {
    getCastsByActorId(actorId: ID!): [Cast!]!
    getCastsByMovieId(movieId: ID!): [Cast!]!
  }
`;

export const schemaString = typeDefs.loc?.source.body!;

export const resolvers = {
  Query: {
    getCastsByActorId: (_: any, { actorId }: { actorId: string }) =>
      data.getCastsByActorId(actorId),
    getCastsByMovieId: (_: any, { movieId }: { movieId: string }) =>
      data.getCastsByMovieId(movieId),
  },
};
