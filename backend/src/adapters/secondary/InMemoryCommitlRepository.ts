import type { Commit } from "../../domain/git/entities/Commit";
import { CommitRepository } from "../../domain/git/ports/CommitRepository";

export class InMemoryCommitRepository implements CommitRepository {
  private _commits: Commit[] = [];

  public async add(commit: Commit) {
    this._commits.push(commit);
  }

  // The following methods for test purposes only
  get commits() {
    return this._commits;
  }
}
