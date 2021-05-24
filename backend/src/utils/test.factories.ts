import type { Model } from "../domain/git/entities/Model";

const defaultModel: Model = {
  modelId: "awesomeModel",
  latestCommit: "greatCommit",
  lastModified: new Date("2020-11-02T10:00:00Z"),
  files: [],
};

export const makeModel = (partialModel?: Partial<Model>) => {
  return partialModel ? { ...defaultModel, ...partialModel } : defaultModel;
};
