type Id = string;
type BaseActor = {
  name: string;
  movieId: string;
};

export type Actor = BaseActor & { id: Id };
export type CreateActorInput = BaseActor;

const actors: Record<Id, BaseActor> = {
  "1": {
    name: "Tim Robbins",
    movieId: "1",
  },
  "2": {
    name: "Morgan Freeman",
    movieId: "1",
  },
  "3": {
    name: "Marlon Brando",
    movieId: "2",
  },
  "4": {
    name: "Al Pacino",
    movieId: "2",
  },
  "5": {
    name: "Elijah Wood",
    movieId: "3",
  },
  "6": {
    name: "Ian McKellen",
    movieId: "3",
  },
};

export const getActors = (): Actor[] => {
  return Object.entries(actors).map(([id, actor]) => ({ ...actor, id }));
};

export const getActor = (id: Id): Actor => {
  if (!(id in actors)) {
    throw new Error(`Actor with id ${id} not found`);
  }

  return { ...actors[id], id };
};

export const createActor = (input: CreateActorInput): Actor => {
  const id = Math.random().toString(36).slice(2, 9);
  actors[id] = input;

  return { ...input, id };
};
