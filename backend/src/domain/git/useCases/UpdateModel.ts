import { UseCase } from "../../core/UseCase";
import { Commit } from "../entities/Commit";
import { ModelId } from "../entities/Model";
import { File } from "../entities/File";
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
            this.addFileToModel(commit.modelId, {
              name: fileUpdate.name,
              content: fileUpdate.content,
            });
            break;
          //   case "deleted":
          //     this.removeFileFromModel(
          //       commit.modelId,
          //       fileUpdate.name
          //     );
          //     break;
          //   case "changed":
          //     this.updateFileFromModel(commit.modelId, {
          //       name: fileUpdate.name,
          //       content: fileUpdate.content,
          //     });
          //     break;
        }
      })
    );
  }
  public async addFileToModel(modelId: ModelId, file: File) {
    const previousStoredModel = await this.modelRepository.getModelById(
      modelId
    );
    if (!previousStoredModel) {
      return;
    }
    this.modelRepository.update(modelId, {
      files: [...previousStoredModel.files, file],
    });
  }
}
