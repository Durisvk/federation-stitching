type Id = string;
type BaseMovie = {};

export type Movie = BaseMovie & { id: Id };
export type CreateMovieInput = BaseMovie;

const movies: Record<Id, BaseMovie> = {
  "1": {
    title: "The Shawshank Redemption",
    year: 1994,
  },
  "2": {
    title: "The Godfather",
    year: 1972,
  },
  "3": {
    title: "Lord of the Rings: The Fellowship of the Ring",
    year: 2001,
  },
  "4": {
    title: "Pár Pařmenů",
    year: 2004,
  },
};

export const getMovies = (): Movie[] => {
  return Object.entries(movies).map(([id, movie]) => ({ ...movie, id }));
};

export const getMovie = (id: Id): Movie => {
  if (!(id in movies)) {
    throw new Error(`Movie with id ${id} not found`);
  }

  return { ...movies[id], id };
};

export const createMovie = (input: CreateMovieInput): Movie => {
  const id = Math.random().toString(36).slice(2, 9);
  movies[id] = input;

  return { ...input, id };
};
