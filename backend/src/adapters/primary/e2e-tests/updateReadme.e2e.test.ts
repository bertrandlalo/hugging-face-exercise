import supertest from "supertest";
import type { UpdateModelParams } from "../../../domain/git/useCases/UpdateModel";
import { app } from "../server";

const request = supertest(app);

describe("Mimic commit that affects README route", () => {
  it("Changes the README of the model (already existing or not)", async () => {
    const payload: UpdateModelParams = {
      commit: {
        commitId: "commitABC",
        fileUpdates: [
          {
            name: "README.md",
            content: "New description of model",
            kind: "changed",
          },
        ],
        date: new Date(2020),
        modelId: "great-ai",
      },
    };
    const response = await request.post("/updateReadme").send(payload);
    expect(response.body).toEqual({ success: true });
  });
});
