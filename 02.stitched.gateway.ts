import { Kind, OperationTypeNode } from "graphql";
import { ApolloServer, gql } from "apollo-server";
import { stitchSchemas } from "@graphql-tools/stitch";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { batchDelegateToSchema } from "@graphql-tools/batch-delegate";
import { delegateToSchema } from "@graphql-tools/delegate";
import { FilterRootFields, FilterTypes } from "@graphql-tools/wrap";

import * as movie from "./services/movie/schema.stitched";
import * as actor from "./services/actor/schema.stitched";
import * as casts from "./services/cast/schema.stitched";

import * as rating from "./services/rating/client.rest";

const subschemas = {
  movie: makeExecutableSchema({
    typeDefs: movie.typeDefs,
    resolvers: movie.resolvers,
  }),
  actor: makeExecutableSchema({
    typeDefs: actor.typeDefs,
    resolvers: actor.resolvers,
  }),
  casts: makeExecutableSchema({
    typeDefs: casts.schemaString,
    resolvers: casts.resolvers,
  }),
};

const schema = stitchSchemas({
  subschemas: [
    { schema: subschemas.movie },
    { schema: subschemas.actor },
    {
      schema: subschemas.casts,
      transforms: [
        new FilterRootFields(
          (op, rootField) =>
            op !== "Query" ||
            !["getCastsByActorId", "getCastsByMovieId"].includes(rootField)
        ),
        new FilterTypes((type) => type.name !== "Cast"),
      ],
    },
  ],
  typeDefs: gql`
    extend type Query {
      ratings: [Rating]!
      rating(id: ID!): Rating!
    }

    input CreateRatingInput {
      movieId: ID!
      score: Int!
    }

    extend type Mutation {
      createRating(input: CreateRatingInput!): Rating!
    }

    extend type Actor {
      movies: [Movie!]!
    }

    extend type Movie {
      actors: [Actor!]!
      rating: Rating!
    }

    type Rating {
      id: ID!
      movie: Movie!
      score: Int!
    }
  `,
  resolvers: {
    Actor: {
      movies: {
        selectionSet: `{ id }`,
        resolve: async (actor, _args, context, info) => {
          const casts = await delegateToSchema({
            schema: subschemas.casts,
            operation: OperationTypeNode.QUERY,
            fieldName: "getCastsByActorId",
            args: { actorId: actor.id },
            context,
            info,
            selectionSet: {
              kind: Kind.SELECTION_SET,
              selections: [
                {
                  kind: Kind.FIELD,
                  name: { kind: Kind.NAME, value: "movieId" },
                },
              ],
            },
          });

          const movieIds = casts.map(({ movieId }) => movieId);

          return batchDelegateToSchema({
            schema: subschemas.movie,
            operation: OperationTypeNode.QUERY,
            fieldName: "movies",
            key: movieIds,
            argsFromKeys: (ids: readonly string[]) => ({ ids }),
            context,
            info,
          });
        },
      },
    },

    Movie: {
      actors: {
        selectionSet: `{ id }`,
        resolve: async (movie, _args, context, info) => {
          const casts = await delegateToSchema({
            schema: subschemas.casts,
            operation: OperationTypeNode.QUERY,
            fieldName: "getCastsByMovieId",
            args: { movieId: movie.id },
            context,
            info,
            selectionSet: {
              kind: Kind.SELECTION_SET,
              selections: [
                {
                  kind: Kind.FIELD,
                  name: { kind: Kind.NAME, value: "actorId" },
                },
              ],
            },
          });

          const actorIds = casts.map(({ actorId }) => actorId);

          return batchDelegateToSchema({
            schema: subschemas.actor,
            operation: OperationTypeNode.QUERY,
            fieldName: "actors",
            key: actorIds,
            argsFromKeys: (ids: readonly string[]) => ({ ids }),
            context,
            info,
          });
        },
      },

      rating: {
        selectionSet: `{ id }`,
        resolve: async (movie, _args) => {
          return rating.client.get(`/movies/${movie.id}/rating`);
        },
      },
    },

    // REST wrapper:
    Query: {
      ratings: () => {
        return rating.client.get("/ratings");
      },
      rating: (_parent, { id }) => {
        return rating.client.get(`/ratings/${id}`);
      },
    },

    Mutation: {
      createRating: (_parent, { input }) => {
        return rating.client.post("/ratings", input);
      },
    },

    Rating: {
      movie: {
        selectionSet: `{ movieId }`,
        resolve: async (rating, _args, context, info) => {
          return delegateToSchema({
            schema: subschemas.movie,
            operation: OperationTypeNode.QUERY,
            fieldName: "movie",
            args: { id: rating.movieId },
            context,
            info,
          });
        },
      },
    },
  },
});

new ApolloServer({ schema }).listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
