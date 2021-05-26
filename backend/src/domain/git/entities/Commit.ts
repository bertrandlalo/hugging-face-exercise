import { ModelId } from "./Model";
import { File } from "./File";

export type FileUpdate = File & {
  kind: "deleted" | "changed" | "added";
};

export type Commit = {
  commitId: string;
  fileUpdates: FileUpdate[];
  date: Date;
  message?: string;
  modelId: ModelId;
};
