import type { Model, ModelId } from "../../../domain/git/entities/Model";

export type PipelineTag =
  | "fill-mask"
  | "translation"
  | "text-classification"
  | "question-answering"
  | "token-classification"
  | "summarization"
  | "audio-source-separation";

export type ModelInfo = {
  modelId: ModelId;
  private: boolean;
  pipeline_tag?: PipelineTag; // Or should be a list ?
  key?: string;
};

export interface HuggingFaceAPI {
  fetchAllModelInfos: (matchesInModelId?: string[]) => Promise<ModelInfo[]>;
  getLatestModelForId: (modelId: ModelId) => Promise<Model | null>;
}
