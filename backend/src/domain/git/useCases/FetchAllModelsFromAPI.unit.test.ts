import { InMemoryModelRepository } from "../../../adapters";
import { FakeHuggingFaceAPI } from "../../../adapters/secondary/FakeHuggingFaceAPI";
import { makeModel } from "../../../utils/test.factories";
import { FetchAllModelsFromAPI } from "./FetchAllModelsFromAPI";

describe("Fetch All Models from API", () => {
  let fetchAllModelsFromAPI: FetchAllModelsFromAPI;
  let modelRepo: InMemoryModelRepository;
  let huggingFaceAPI: FakeHuggingFaceAPI;

  beforeEach(() => {
    modelRepo = new InMemoryModelRepository();
    huggingFaceAPI = new FakeHuggingFaceAPI();
    fetchAllModelsFromAPI = new FetchAllModelsFromAPI(
      modelRepo,
      huggingFaceAPI
    );
  });

  describe("Fetch all models from API", () => {
    it("Does nothing when fetch from API is empty", async () => {
      await fetchAllModelsFromAPI.execute({});
      expect(modelRepo.models).toEqual([]);
    });
  });
  it("Skips model that cannot be fetched from API", async () => {
    huggingFaceAPI.setAllModelInfosResponse([
      { modelId: "modelIdFromModeThatCannotBeFetched", private: false },
    ]);
    await fetchAllModelsFromAPI.execute({});

    expect(modelRepo.models).toEqual([]);
  });
  it("Adds models in repo when fetch is not empty and all infos can be found.", async () => {
    // Artificially set model in Fake API
    const modelA = makeModel({ modelId: "modelA" });
    const modelB = makeModel({ modelId: "modelB" });
    huggingFaceAPI.setPublicModels([modelA, modelB]);
    huggingFaceAPI.setAllModelInfosResponse([
      { modelId: "modelA", private: false },
      { modelId: "modelB", private: false },
      { modelId: "modelC", private: true },
    ]);
    await fetchAllModelsFromAPI.execute({});

    expect(modelRepo.models).toEqual([modelA, modelB]);
  });
});
