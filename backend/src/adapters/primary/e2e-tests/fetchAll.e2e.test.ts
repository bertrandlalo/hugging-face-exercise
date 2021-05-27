import supertest from "supertest";
import type { FetchAllParams } from "../../../domain/git/useCases/FetchAllModelsFromAPI";
import { app } from "../server";

const request = supertest(app);

describe("FetchAll route", () => {
  it("Fills the model repo with all Hugging Face models", async () => {
    const payload: FetchAllParams = {
      matchingModelId: ["RaphBL", "etalab-ia"],
    };
    const response = await request.get("/fetchAll").query(payload);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ modelId: "RaphBL/great-model" }),
      ])
    );
  });
});
