import type { PipelineTag } from "../../git/ports/HuggingFaceAPI";

export type ModelId = string;
export type CommitId = string;

export type Model = {
  modelId: ModelId;
  latestCommit: CommitId;
  lastModified?: Date;
  description?: string;
  files: File[];
  pipelineTag?: PipelineTag;
};
