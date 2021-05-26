import type { PipelineTag } from "../../git/ports/HuggingFaceAPI";
import type { File } from "../../git/entities/File";

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
