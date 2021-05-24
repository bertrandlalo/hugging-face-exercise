import axios from "axios";
import type { Model, ModelId } from "../../domain/git/entities/Model";

import {
  HuggingFaceAPI,
  ModelInfo,
} from "../../domain/git/ports/HuggingFaceAPI";

export class HttpHuggingFaceAPI implements HuggingFaceAPI {
  public async fetchAllModelInfos(
    matchesInModelId?: string[]
  ): Promise<ModelInfo[]> {
    // Make a request for a user with a given ID
    const response = await axios.get("https://huggingface.co/api/models");
    return matchesInModelId
      ? response.data.filter((modelInfo: ModelInfo) => {
          return matchesInModelId?.some((match) =>
            modelInfo.modelId.match(match)
          );
        })
      : response.data;
  }
  public async getLatestModelForId(modelId: ModelId): Promise<Model | null> {
    const readmeResponse = await axios.get(
      `https://huggingface.co/${modelId}/raw/main/README.md`
    );
    if (readmeResponse.status != 200) {
      return null;
    }
    const readmeContent = readmeResponse.data;

    return {
      modelId: modelId,
      latestCommit: "commitABC", // ToDo
      description: readmeContent.split("---").pop().split("---").pop(),
      files: [], // ToDo
    };
  }
}
