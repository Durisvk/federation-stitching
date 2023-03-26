type Id = string;
type BaseRating = {
  score: number;
  movieId: string;
};

export type Rating = BaseRating & { id: Id };
export type CreateRatingInput = BaseRating;

const ratings: Record<Id, BaseRating> = {
  "1": {
    score: 10,
    movieId: "1",
  },
  "2": {
    score: 10,
    movieId: "2",
  },
  "3": {
    score: 100,
    movieId: "3",
  },
};

export const getRatings = (): Rating[] => {
  return Object.entries(ratings).map(([id, rating]) => ({ ...rating, id }));
};

export const getRating = (id: Id): Rating => {
  return {
    ...ratings[id],
    id,
  };
};

export const getRatingByMovieId = (movieId: Id): Rating => {
  return getRatings().find((rating) => rating.movieId === movieId);
};

export const createRating = (input: CreateRatingInput): Rating => {
  const id = Math.random().toString(36).slice(2, 9);
  ratings[id] = input;

  return { ...input, id };
};
