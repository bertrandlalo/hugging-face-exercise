import type { Model, ModelId } from "../../domain/git/entities/Model";
import type { File, FileName } from "../../domain/git/entities/File";

import { ModelRepository } from "../../domain/git/ports/ModelRepository";

export class InMemoryModelRepository implements ModelRepository {
  private _models: Record<ModelId, Model> = {};

  public async modelIdExists(modelId: ModelId) {
    return !!this._models[modelId];
  }

  public async add(model: Model) {
    this._models[model.modelId] = model;
  }

  public async update(modelId: ModelId, changes: Partial<Model>) {
    this._models[modelId] = { ...this._models[modelId], ...changes };
  }

  public async getModelIdsWithDescriptionLike(text: string) {
    return Object.keys(this._models).filter((modelId) => {
      const model = this._models![modelId];
      return model.description === undefined
        ? false
        : model.description.toLowerCase().includes(text.toLowerCase());
    });
  }
  public async addFileToModel(modelId: ModelId, file: File) {
    const previousStoredModel = this._models[modelId];
    if (!previousStoredModel) {
      return;
    }
    this.update(modelId, { files: [...previousStoredModel.files, file] });
  }
  public async updateFileFromModel(modelId: ModelId, file: File) {
    throw new Error("Not implemented");
  }
  public async removeFileFromModel(modelId: ModelId, fileName: FileName) {
    throw new Error("Not implemented");
  }
  // The following methods for test purposes only
  get models() {
    return Object.values(this._models);
  }

  setModels(models: Model[]) {
    this._models = models.reduce((acc, model) => {
      acc[model.modelId] = model;
      return acc;
    }, {} as Record<ModelId, Model>);
  }
}
