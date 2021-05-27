import { UseCase } from "../../core/UseCase";
import type { ModelId } from "../entities/Model";
import { ModelRepository } from "../ports/ModelRepository";

export type GetReadmeFromRepoParams = {
  modelId: ModelId;
};

export class GetReadmeFromRepo
  implements UseCase<GetReadmeFromRepoParams, string | undefined | null> {
  private modelRepository: ModelRepository;

  constructor(modelRepository: ModelRepository) {
    this.modelRepository = modelRepository;
  }

  public async execute({ modelId }: GetReadmeFromRepoParams) {
    const model = await this.modelRepository.getModelById(modelId);
    if (model === undefined) {
      return null;
    }
    return model.description;
  }
}
