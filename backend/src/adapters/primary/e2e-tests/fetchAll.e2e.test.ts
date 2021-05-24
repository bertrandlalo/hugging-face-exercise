import supertest from "supertest";
import type { FetchAllParams } from "../../../domain/git/useCases/FetchAllModelsFromAPI";
import type { SearchModelParams } from "../../../domain/git/useCases/SearchModels";
import { app } from "../server";

const request = supertest(app);

describe("FetchAll route", () => {
  it("Fills the model repo with all Hugging Face models", async () => {
    const payload: FetchAllParams = { fromUsers: ["RaphBL", "etalab-ia"] };
    const response = await request.get("/fetchAll").send(payload);
    expect(response.body).toEqual({ success: true });
  });
  it("Returns RaphBL/great-model when seaching", async () => {
    const payload: SearchModelParams = {
      query: "GreatModel does not solve any NLP problem",
    };
    // await request.get("/fetchAll");
    const response = await request.get("/search").send(payload);
    expect(response.body).toEqual(["RaphBL/great-model"]);
  });
});