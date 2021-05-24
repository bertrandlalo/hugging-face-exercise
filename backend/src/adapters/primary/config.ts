import { FetchAllModelsFromAPI } from "../../domain/git/useCases/FetchAllModelsFromAPI";
import { GetUsers } from "../../domain/git/useCases/GetUsers";
import { SearchModels } from "../../domain/git/useCases/SearchModels";
import { HttpHuggingFaceAPI } from "../secondary/HttpHuggingFaceAPI";
import { InMemoryModelRepository } from "../secondary/InMemoryModelRepository";
import { JsonModelRepository } from "../secondary/JsonModelRepository";

export const getRepositories = () => {
  console.log("Repositories : ", process.env.REPOSITORIES ?? "IN_MEMORY");

  return {
    models:
      process.env.REPOSITORIES === "JSON"
        ? new JsonModelRepository(`${__dirname}/../secondary/app-data.json`)
        : new InMemoryModelRepository(), // Todo: Implement Json
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
    getUsers: new GetUsers(huggingFaceAPI),
  };
};