import { UseCase } from "../../core/UseCase";
import { Model } from "../entities/Model";
import { HuggingFaceAPI } from "../ports/HuggingFaceAPI";
import { ModelRepository } from "../ports/ModelRepository";

export type FetchAllParams = {
  matchingModelId?: string[];
  limitNumberOfModels?: number;
};

export class FetchAllModelsFromAPI implements UseCase<FetchAllParams, Model[]> {
  private modelRepository: ModelRepository;
  private api: HuggingFaceAPI;

  constructor(modelRepository: ModelRepository, api: HuggingFaceAPI) {
    this.modelRepository = modelRepository;
    this.api = api;
  }

  public async execute({
    matchingModelId,
    limitNumberOfModels,
  }: FetchAllParams) {
    console.log("matchingModelId: ", matchingModelId);
    const modelInfos = await this.api.fetchAllModels(matchingModelId);
    console.log("modelInfos: ", modelInfos);
    const models = await Promise.all(
      modelInfos
        .filter((modelInfo) => !modelInfo.private) // Only public & from those users
        .slice(0, limitNumberOfModels) // Limit number of models to fetch
        .map(async (modelInfo) =>
          this.api.getLatestModelForId(modelInfo.modelId)
        )
    );
    console.log(`Successfully fetched ${models.length} models from API`);
    await Promise.all(
      models.map((model) => {
        if (model) {
          this.modelRepository.add(model);
        }
      })
    );
    console.log(`Successfully added ${models.length} models to repo`);
    return models.filter(notNull);
  }
}

function notNull<T>(value: T | null): value is T {
  return value !== null;
}
