import { buildSubgraphSchema } from "@apollo/federation";
import { gql } from "apollo-server";
import * as data from "./data";

export const typeDefs = gql`
  type Query {
    movies(ids: [ID!]): [Movie!]
    movie(id: ID!): Movie
  }

  type Mutation {
    createMovie(input: CreateMovieInput!): Movie
  }

  input CreateMovieInput {
    title: String
    year: Int
  }

  type Movie @key(fields: "id") {
    id: ID!
    title: String
    year: Int
  }
`;

export const schemaString = typeDefs.loc?.source.body!;

export const resolvers = {
  Query: {
    movies: (_: any, { ids }: { ids?: string[] }) => {
      return ids
        ? data.getMovies().filter(({ id }) => ids.includes(id))
        : data.getMovies();
    },
    movie: (_: any, { id }: { id: string }) => {
      const result = data.getMovie(id);
      console.log("movie", result);
      return result;
    },
  },
  Mutation: {
    createMovie: (_: any, { input }: any) => data.createMovie(input),
  },

  Movie: {
    __resolveReference: (movie: data.Movie) => data.getMovie(movie.id),
  },
};

export const schema = buildSubgraphSchema({
  typeDefs,
  resolvers,
});
