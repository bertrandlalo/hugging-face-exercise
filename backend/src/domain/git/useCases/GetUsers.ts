import { UseCase } from "../../core/UseCase";
import { HuggingFaceAPI } from "../ports/HuggingFaceAPI";

export class GetUsers implements UseCase<void, string[]> {
  private api: HuggingFaceAPI;

  constructor(api: HuggingFaceAPI) {
    this.api = api;
  }

  public async execute() {
    const modelInfos = await this.api.fetchAllModelInfos();
    return modelInfos
      .map((modelInfo) => modelInfo.modelId.split("/").shift())
      .filter(Boolean) as string[]; // TODO: Remove this ugly `as`.
  }
}
