import axios from "axios";
import type { Model, ModelId } from "../../domain/git/entities/Model";

import {
  HuggingFaceAPI,
  ModelInfo,
} from "../../domain/git/ports/HuggingFaceAPI";

export class HttpHuggingFaceAPI implements HuggingFaceAPI {
  public async fetchAllModels(
    matchingModelId?: string[]
  ): Promise<ModelInfo[]> {
    // Make a request for a user with a given ID
    const response = await axios.get("https://huggingface.co/api/models");
    return matchingModelId
      ? response.data.filter((modelInfo: ModelInfo) => {
          return matchingModelId?.some((match) =>
            modelInfo.modelId.match(match)
          );
        })
      : response.data;
  }
  public async getLatestModelForId(modelId: ModelId): Promise<Model | null> {
    try {
      const readmeResponse = await axios.get(
        `https://huggingface.co/${modelId}/raw/main/README.md`
      );
      const readmeContent = readmeResponse.data;
      console.log("Succesfully fetch README from model ", modelId);
      return {
        modelId: modelId,
        latestCommit: "commitABC", // ToDo
        description: readmeContent,
        files: [], // ToDo
      };
    } catch (error) {
      console.warn(`Could not fetch README.md from model ${modelId}`);
      return null;
    }
  }
}
