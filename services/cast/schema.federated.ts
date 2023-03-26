import { buildSubgraphSchema } from "@apollo/federation";
import { gql } from "apollo-server";
import * as data from "./data";

export const typeDefs = gql`
  type Actor @key(fields: "id") {
    id: ID!
    movies: [Movie!]!
  }

  type Movie @key(fields: "id") {
    id: ID!
    actors: [Actor!]!
  }
`;

export const resolvers = {
  Actor: {
    movies: (actor: { id: string }) =>
      data.getMoviesForActor(actor.id).map((id) => ({ id })),
  },

  Movie: {
    actors: (movie: { id: string }) =>
      data.getActorsForMovie(movie.id).map((id) => ({ id })),
  },
};

export const schema = buildSubgraphSchema({
  typeDefs,
  resolvers,
});
