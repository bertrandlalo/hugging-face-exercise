import { UseCase } from "../../core/UseCase";
import type { Model } from "../entities/Model";
import { HuggingFaceAPI } from "../ports/HuggingFaceAPI";
import { ModelRepository } from "../ports/ModelRepository";

export type FetchAllParams = {
  fromUsers?: string[];
  limitNumberOfModels?: number;
};

export class FetchAllModelsFromAPI implements UseCase<FetchAllParams, void> {
  private modelRepository: ModelRepository;
  private api: HuggingFaceAPI;

  constructor(modelRepository: ModelRepository, api: HuggingFaceAPI) {
    this.modelRepository = modelRepository;
    this.api = api;
  }

  public async execute({ fromUsers, limitNumberOfModels }: FetchAllParams) {
    console.log("fromUsers: ", fromUsers);
    const modelInfos = await this.api.fetchAllModelInfos(fromUsers);
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
          this.addOrUpdateInModelRepo(model);
        }
      })
    );
    console.log(`Successfully added ${models.length} models to repo`);
  }

  private async addOrUpdateInModelRepo(model: Model) {
    const modelIdExists = await this.modelRepository.modelIdExists(
      model.modelId
    );
    if (modelIdExists) {
      await this.modelRepository.update(model.modelId, model);
    }
    await this.modelRepository.add(model);
  }
}
