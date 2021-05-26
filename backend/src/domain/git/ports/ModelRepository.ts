import type { Model, ModelId } from "../entities/Model";
import type { File, FileName } from "../entities/File";

export interface ModelRepository {
  modelIdExists: (modelId: ModelId) => Promise<boolean>;
  getModelIdsWithDescriptionLike: (search: string) => Promise<ModelId[]>;
  add: (model: Model) => Promise<void>;
  update: (modelId: ModelId, changes: Partial<Model>) => Promise<void>;
  addFileToModel: (modelId: ModelId, file: File) => Promise<void>;
  removeFileFromModel: (modelId: ModelId, name: FileName) => Promise<void>;
  updateFileFromModel: (modelId: ModelId, file: File) => Promise<void>;
}
