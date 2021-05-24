import type { Model, ModelId } from "../../domain/git/entities/Model";
import {
  HuggingFaceAPI,
  ModelInfo,
} from "../../domain/git/ports/HuggingFaceAPI";

export class FakeHuggingFaceAPI implements HuggingFaceAPI {
  private _modelsInfos: ModelInfo[] = [];
  private _models: Record<ModelId, Model> = {};

  public async fetchAllModelInfos() {
    return this._modelsInfos;
  }
  public async getLatestModelForId(modelId: ModelId) {
    return this._models[modelId];
  }

  // The following methods for test purposes only
  setPublicModels(models: Model[]) {
    this._models = models.reduce((acc, model) => {
      acc[model.modelId] = model;
      return acc;
    }, {} as Record<ModelId, Model>);
  }
  setAllModelInfosResponse(modelInfos: ModelInfo[]) {
    this._modelsInfos = modelInfos;
  }
}
