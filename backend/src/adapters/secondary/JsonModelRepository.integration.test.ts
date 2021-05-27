import * as fs from "fs";
import * as util from "util";
import type { Model } from "../../domain/git/entities/Model";
import { makeModel } from "../../utils/test.factories";
import { JsonModelRepository } from "./JsonModelRepository";

const readFile = util.promisify(fs.readFile);

describe("JsonModelRepository", () => {
  const dataPath = `${__dirname}/data-test.json`;
  let modelRepo: JsonModelRepository;

  beforeEach(() => {
    fs.writeFileSync(dataPath, "[]");
    modelRepo = new JsonModelRepository(dataPath);
  });

  describe("Add to json repo", () => {
    it("adds a new model to the json file", async () => {
      const model = makeModel();
      await modelRepo.add(model);
      await expectRepoDataToBe([model]);
    });
  });

  const expectRepoDataToBe = async (models: Model[]) => {
    const data = await readFile(dataPath);
    expect(data.toString()).toEqual(JSON.stringify(models));
  };
});
