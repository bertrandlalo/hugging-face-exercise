import { UseCase } from "../../core/UseCase";
import { HuggingFaceAPI } from "../ports/HuggingFaceAPI";

export class GetAllModelIdsFromAPI implements UseCase<void, string[]> {
  private api: HuggingFaceAPI;

  constructor(api: HuggingFaceAPI) {
    this.api = api;
  }

  public async execute() {
    const modelInfos = await this.api.fetchAllModelInfos();
    return modelInfos.map((modelInfo) => modelInfo.modelId);
  }
}
