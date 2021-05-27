import type { Model, ModelId } from "../entities/Model";

export interface ModelRepository {
  getModelById: (modelId: ModelId) => Promise<Model | undefined>;
  getModelIdsWithDescriptionLike: (search: string) => Promise<ModelId[]>;
  add: (model: Model) => Promise<void>;
  update: (modelId: ModelId, changes: Partial<Model>) => Promise<void>;
}
