import { InMemoryModelRepository } from "../../../adapters";
import { makeModel } from "../../../utils/test.factories";
import { SearchModels } from "./SearchModels";

describe("My Use case", () => {
  let modelRepo: InMemoryModelRepository;
  let searchModels: SearchModels;

  beforeEach(() => {
    modelRepo = new InMemoryModelRepository();
    searchModels = new SearchModels(modelRepo);
  });

  describe("Search for text in models descriptions", () => {
    it("Returns an empty list when no models", async () => {
      const selectedModels = await searchModels.execute({ query: "" });
      expect(selectedModels).toEqual([]);
    });
    it("Returns a list with the model Id having a description that match the given text", async () => {
      const modelAboutNLP = makeModel({
        modelId: "hugging/NLP",
        description: "This model solves NLP",
      });
      const modelAboutBirds = makeModel({
        modelId: "hugging/birds",
        description: "This model recognizes birds",
      });
      modelRepo.setModels([modelAboutNLP, modelAboutBirds]);
      expect(await searchModels.execute({ query: "NLP" })).toEqual([
        "hugging/NLP",
      ]);
      expect(await searchModels.execute({ query: "This model" })).toEqual([
        "hugging/NLP",
        "hugging/birds",
      ]);
    });
  });
});
