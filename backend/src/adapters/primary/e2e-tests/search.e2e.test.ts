import supertest from "supertest";
import type { SearchModelParams } from "../../../domain/git/useCases/SearchModels";
import { app } from "../server";

const request = supertest(app);

describe("Search route", () => {
  it("Returns RaphBL/great-model when seaching the description", async () => {
    const payload: SearchModelParams = {
      query: "GreatModel does not solve any NLP problem",
    };
    await request.get("/fetchAll").query({
      matchingModelId: ["RaphBL", "etalab-ia"],
    });
    const response = await request.get("/search").query(payload);
    expect(response.body).toEqual(["RaphBL/great-model"]);
  });
});
