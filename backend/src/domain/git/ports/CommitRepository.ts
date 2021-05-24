import { Commit } from "../entities/Commit";

export interface CommitRepository {
  add: (commit: Commit) => Promise<void>;
}
