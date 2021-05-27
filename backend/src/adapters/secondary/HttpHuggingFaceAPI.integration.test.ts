import type { Model } from "../../domain/git/entities/Model";
import { HuggingFaceAPI } from "../../domain/git/ports/HuggingFaceAPI";
import { HttpHuggingFaceAPI } from "./HttpHuggingFaceAPI";

describe("HttpHuggingFaceAPI", () => {
  let httpHuggingFaceAPI: HuggingFaceAPI;

  beforeEach(() => {
    httpHuggingFaceAPI = new HttpHuggingFaceAPI();
    // TODO : Here should be where our testing model is commited (and then removed after the tests)
  });

  describe("fetch all models infos", () => {
    it("returns a list with model infos, amonst which the one we added for test purposes", async () => {
      const actualAllModelInfos = await httpHuggingFaceAPI.fetchAllModels();
      expect(actualAllModelInfos).toContainEqual({
        modelId: "RaphBL/great-model",
        private: false,
        pipeline_tag: "question-answering",
        key: "",
      });
    });
  });
  describe("fetch all models infos", () => {
    it("returns a list with model infos, amonst which the one we added for test purposes", async () => {
      const actualModel = await httpHuggingFaceAPI.getLatestModelForId(
        "RaphBL/great-model"
      );
      const expectedModel: Model = {
        modelId: "RaphBL/great-model",
        latestCommit: "commitABC", // ToDo.
        files: [],
        description:
          "GreatModel does not solve any NLP problem ... for exercise purpose only.",
      };
      expect(actualModel).toBeTruthy();
      assertModelsAreEqual(actualModel!, expectedModel);
    });
  });
});

const assertModelsAreEqual = (actual: Model, expected: Model) => {
  // Small helper to compare two models (because I'm bothered by full text comparison)
  // Todo : improve text comparison.
  expect(actual?.description?.trim()).toEqual(expected.description?.trim());
  expect({ ...actual, description: "" }).toEqual({
    ...expected,
    description: "",
  });
};
