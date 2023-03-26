type Id = string;
type BaseCast = {
  actorId: string;
  movieId: string;
};

export type Cast = BaseCast & { id: Id };

const casts: Record<Id, BaseCast> = {
  "1": {
    actorId: "1",
    movieId: "1",
  },
  "2": {
    actorId: "2",
    movieId: "1",
  },
  "3": {
    actorId: "3",
    movieId: "2",
  },
  "4": {
    actorId: "4",
    movieId: "2",
  },
  "5": {
    actorId: "5",
    movieId: "3",
  },
  "6": {
    actorId: "6",
    movieId: "3",
  },
};

export const getCasts = (): Cast[] => {
  return Object.entries(casts).map(([id, cast]) => ({ ...cast, id }));
};

export const getCastsByActorId = (actorId: Id): Cast[] => {
  return getCasts().filter((cast) => cast.actorId === actorId);
};

export const getCastsByMovieId = (movieId: Id): Cast[] => {
  return getCasts().filter((cast) => cast.movieId === movieId);
};

export const getMoviesForActor = (actorId: Id): string[] => {
  return getCastsByActorId(actorId).map(({ movieId }) => movieId);
};

export const getActorsForMovie = (movieId: Id): string[] => {
  return getCastsByMovieId(movieId).map(({ actorId }) => actorId);
};
