import type { Model, ModelId } from "../entities/Model";

export interface ModelRepository {
  modelIdExists: (modelId: ModelId) => Promise<boolean>;
  getModelIdsWithDescriptionLike: (search: string) => Promise<ModelId[]>;
  add: (model: Model) => Promise<void>;
  update: (modelId: ModelId, changes: Partial<Model>) => Promise<void>;
}
