import { makeModel } from "../../utils/test.factories";
import { expectStringifiedToEqual } from "../../utils/test.helpers";
import { ElasticModelRepository } from "./ElasticModelRepository";

describe("ElasticModelRepository", () => {
  let elasticModelRepo: ElasticModelRepository;

  beforeEach(async () => {
    elasticModelRepo = new ElasticModelRepository();
    await elasticModelRepo.removeAllModels();
  });
  describe("can connect to elastic search", async () => {
    return;
  });
  describe("add, retrieve and update a model", () => {
    const modelFoo123 = makeModel({
      modelId: "foo123",
      description: "about NLP",
    });
    beforeEach(async () => {
      await elasticModelRepo.add(modelFoo123);
    });

    it("retrieve a model that has been added", async () => {
      const retrievedModelFoo123 = await elasticModelRepo.getModelById(
        "foo123"
      );
      expectStringifiedToEqual(retrievedModelFoo123, modelFoo123);
    });
    it("returns undefined when modelId is not in the index", async () => {
      const retrievedModelNotIndexed = await elasticModelRepo.getModelById(
        "bar456"
      );
      expect(retrievedModelNotIndexed).toBeUndefined();
    });
  });
  describe("update", () => {
    it("updates a model that exists", async () => {
      await elasticModelRepo.update("foo123", {
        description: "about Face Recognition",
      });
      const retrievedModelFoo123AfterUpdate = await elasticModelRepo.getModelById(
        "foo123"
      );
      expect(retrievedModelFoo123AfterUpdate).toBeDefined();
      expect(retrievedModelFoo123AfterUpdate!.description).toEqual(
        "about Face Recognition"
      );
    });
  });
  describe("search by partial match in description", () => {
    beforeEach(async () => {
      const modelAboutLove = makeModel({
        modelId: "love123",
        description: "This model explains love.",
      });
      const modelAboutLife = makeModel({
        modelId: "life123",
        description: "This model explains LIFZ.",
      });
      await elasticModelRepo.add(modelAboutLove);
      await elasticModelRepo.add(modelAboutLife);
    });
    it("can retrieve a model from one word matching", async () => {
      const matchingModels = await elasticModelRepo.getModelIdsWithDescriptionLike(
        "love"
      );
      expect(matchingModels).toEqual(["love123"]);
    });
    it("can retrieve a model from multiple words matching", async () => {
      const matchingModels = await elasticModelRepo.getModelIdsWithDescriptionLike(
        "explains love"
      );
      expect(matchingModels).toEqual(["love123"]);
    });
    // TODO : PUT Standard Analizer.
    // it("is not case sensitive", async () => {
    //   const matchingModels = await elasticModelRepo.getModelIdsWithDescriptionLike(
    //     "life"
    //   );
    //   expect(matchingModels).toEqual(["life123"]);
    // });
  });
});
