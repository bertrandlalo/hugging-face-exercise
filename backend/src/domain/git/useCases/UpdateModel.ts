import { UseCase } from "../../core/UseCase";
import { Commit } from "../entities/Commit";
import { ModelRepository } from "../ports/ModelRepository";

export type UpdateModelParams = {
  commit: Commit;
};

export class UpdateModel implements UseCase<UpdateModelParams, void> {
  private modelRepository: ModelRepository;

  constructor(modelRepository: ModelRepository) {
    this.modelRepository = modelRepository;
  }
  public async execute({ commit }: UpdateModelParams) {
    await Promise.all(
      commit.fileUpdates.map((fileUpdate) => {
        if (fileUpdate.name === "README.md") {
          this.modelRepository.update(commit.modelId, {
            description: fileUpdate.content,
          });
        }
        switch (fileUpdate.kind) {
          case "added":
            this.modelRepository.addFileToModel(commit.modelId, {
              name: fileUpdate.name,
              content: fileUpdate.content,
            });
            break;
          //   case "deleted":
          //     this.modelRepository.removeFileFromModel(
          //       commit.modelId,
          //       fileUpdate.name
          //     );
          //     break;
          //   case "changed":
          //     this.modelRepository.updateFileFromModel(commit.modelId, {
          //       name: fileUpdate.name,
          //       content: fileUpdate.content,
          //     });
          //     break;
        }
      })
    );
  }
}
