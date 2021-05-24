import * as fs from "fs";
import * as util from "util";
import type { Model, ModelId } from "../../domain/git/entities/Model";
import { InMemoryModelRepository } from "./InMemoryModelRepository";

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

export class JsonModelRepository extends InMemoryModelRepository {
  constructor(private path: string) {
    super();
    this.path = path;
    fs.writeFileSync(path, "[]");
  }

  public async add(model: Model) {
    await super.add(model);
    await this.writeModelsToJson();
  }

  public async update(modelId: ModelId, changes: Partial<Model>) {
    await super.update(modelId, changes);
    await this.writeModelsToJson();
  }

  private async writeModelsToJson() {
    await writeFile(this.path, JSON.stringify(this.models));
  }

  // private async readModelsFromJson() {
  //   const models = await this._readData();
  //   this.setModels(models);
  // }

  // private async _readData(): Promise<Model[]> {
  //   const data = await readFile(this.path);
  //   const models = JSON.parse(data.toString());
  //   return models;
  // }
}
