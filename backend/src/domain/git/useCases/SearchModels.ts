import { UseCase } from "../../core/UseCase";
import type { ModelId } from "../entities/Model";
import { ModelRepository } from "../ports/ModelRepository";

export type SearchModelParams = { query: string };

export class SearchModels implements UseCase<{ query: string }, ModelId[]> {
  private modelRepository: ModelRepository;

  constructor(modelRepository: ModelRepository) {
    this.modelRepository = modelRepository;
  }

  public async execute({ query }: SearchModelParams) {
    const matches = await this.modelRepository.getModelIdsWithDescriptionLike(
      query
    );
    return matches;
  }
}
