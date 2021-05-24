import type { ModelId } from "../../core/Model";

export type Commit = {
  commitId: string;
  files: File[];
  date: Date;
  message?: string;
  modelId: ModelId;
};
