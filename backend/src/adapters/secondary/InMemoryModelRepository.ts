import type { Model, ModelId } from "../../domain/git/entities/Model";
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
