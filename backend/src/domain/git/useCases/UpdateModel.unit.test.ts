import { InMemoryModelRepository } from "../../../adapters";
import { makeModel } from "../../../utils/test.factories";
import { UpdateModel } from "./UpdateModel";
import type { Commit } from "../entities/Commit";
import type { File } from "../entities/File";

describe("Update Model", () => {
  let updateModel: UpdateModel;
  let modelRepo: InMemoryModelRepository;
  let previousReadme: File;

  describe("When a new commit is made on a model repo, ", () => {
    beforeEach(async () => {
      modelRepo = new InMemoryModelRepository();
      updateModel = new UpdateModel(modelRepo);
      previousReadme = { name: "README.md", content: "previous description" };
      await modelRepo.add(
        makeModel({
          modelId: "modelAleardyInRepo",
          files: [previousReadme],
        })
      );
    });

    describe("When the commit contains a deletion ", () => {
      it("removes the file from model files if exists", async () => {
        return;
      });
    });

    describe("When the commit contains an addition ", () => {
      it("adds the file in repo", async () => {
        const newFile = { name: "newFile", content: "Some new content" };
        const fileAdditionCommit: Commit = {
          modelId: "modelAleardyInRepo",
          fileUpdates: [{ ...newFile, kind: "added" }],
          date: new Date("2020-01-01"),
          commitId: "123",
        };
        await updateModel.execute({ commit: fileAdditionCommit });
        expect(modelRepo.models[0].files).toEqual([previousReadme, newFile]);
      });
      it("updates the description if the new file is a README.md", () => {
        return;
      });
    });

    describe("When the commit contains an update ", () => {
      it("update the concerned files if exists", () => {
        return;
      });
      it("updates the description if the update concerns the README.md", async () => {
        const newReadmeFile = {
          name: "README.md",
          content: "Some updated content",
        };
        const fileAdditionCommit: Commit = {
          modelId: "modelAleardyInRepo",
          fileUpdates: [{ ...newReadmeFile, kind: "changed" }],
          date: new Date("2020-01-01"),
          commitId: "123",
        };
        await updateModel.execute({ commit: fileAdditionCommit });
        expect(modelRepo.models[0].description).toEqual("Some updated content");
      });
    });
  });
});
