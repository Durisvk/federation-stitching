import * as data from "./data";

export const typeDefs = /* GraphQL */ `
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

  type Movie {
    id: ID!
    title: String
    year: Int
  }
`;

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
};
