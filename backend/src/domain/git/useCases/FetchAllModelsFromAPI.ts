import { UseCase } from "../../core/UseCase";
import type { Model } from "../entities/Model";
import { HuggingFaceAPI } from "../ports/HuggingFaceAPI";
import { ModelRepository } from "../ports/ModelRepository";

export type FetchAllParams = { fromUsers?: string[] };

export class FetchAllModelsFromAPI implements UseCase<FetchAllParams, void> {
  private modelRepository: ModelRepository;
  private api: HuggingFaceAPI;

  constructor(modelRepository: ModelRepository, api: HuggingFaceAPI) {
    this.modelRepository = modelRepository;
    this.api = api;
  }

  public async execute({ fromUsers }: FetchAllParams) {
    console.log("fromUsers: ", fromUsers);
    const modelInfos = await this.api.fetchAllModelInfos(fromUsers);
    // console.log("modelInfos: ", modelInfos);
    await Promise.all(
      modelInfos
        .filter((modelInfo) => !modelInfo.private) // Only public & from those users
        .slice(0, 10) // Only 10 first (for now)
        .map(async (modelInfo) => {
          const model = await this.api.getLatestModelForId(modelInfo.modelId);
          if (model) {
            await this.addOrUpdateInModelRepo(model);
          } else {
            console.warn("Could not infer model from ", modelInfo.modelId);
          }
        })
    );
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
