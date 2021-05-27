import { FetchAllModelsFromAPI } from "../../domain/git/useCases/FetchAllModelsFromAPI";
import { GetAllModelIdsFromAPI } from "../../domain/git/useCases/GetModelIds";
import { ModelRepository } from "../../domain/git/ports/ModelRepository";

import { SearchModels } from "../../domain/git/useCases/SearchModels";
import { UpdateModel } from "../../domain/git/useCases/UpdateModel";
import { ElasticModelRepository } from "../secondary/ElasticModelRepository";
import { HttpHuggingFaceAPI } from "../secondary/HttpHuggingFaceAPI";
import { InMemoryModelRepository } from "../secondary/InMemoryModelRepository";
import { JsonModelRepository } from "../secondary/JsonModelRepository";
import { GetReadmeFromRepo } from "../../domain/git/useCases/GetReadmeFromRepo";

const getModelRepo = (envVariable?: string): ModelRepository => {
  switch (envVariable) {
    case "JSON":
      return new JsonModelRepository(`${__dirname}/../secondary/app-data.json`);
    case "ELASTIC":
      return new ElasticModelRepository();
    default:
      return new InMemoryModelRepository();
  }
};

export const getRepositories = () => {
  console.log("Repositories : ", process.env.REPOSITORIES ?? "IN_MEMORY");
  return {
    models: getModelRepo(process.env.REPOSITORIES),
  };
};

export const getUsecases = () => {
  const repositories = getRepositories();
  const huggingFaceAPI = new HttpHuggingFaceAPI();
  return {
    fetchAllModelsFromAPI: new FetchAllModelsFromAPI(
      repositories.models,
      huggingFaceAPI
    ),
    searchModels: new SearchModels(repositories.models),
    getAllModelIdsFromAPI: new GetAllModelIdsFromAPI(huggingFaceAPI),
    updateModel: new UpdateModel(repositories.models),
    getReadmeFromRepo: new GetReadmeFromRepo(repositories.models),
  };
};
