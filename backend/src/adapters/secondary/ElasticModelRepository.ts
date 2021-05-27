import type { Model, ModelId } from "../../domain/git/entities/Model";
import { Client, RequestParams } from "@elastic/elasticsearch";
import { ModelRepository } from "../../domain/git/ports/ModelRepository";

export class ElasticModelRepository implements ModelRepository {
  private client: Client;
  constructor() {
    this.client = new Client({ node: "http://localhost:9200" });
  }

  public async add(model: Model) {
    const params: RequestParams.Index = {
      index: "models",
      refresh: true,
      id: model.modelId,
      body: { ...model },
    };
    try {
      await this.client.index(params);
    } catch (error) {
      console.log("Elastic index error ", error);
    }
  }

  public async update(modelId: ModelId, changes: Partial<Model>) {
    const params: RequestParams.Update = {
      index: "models",
      refresh: true,
      id: modelId,
      body: { doc: changes },
    };
    try {
      await this.client.update(params);
    } catch (error) {
      console.log("Elastic update error ", error);
    }
  }

  public async getModelIdsWithDescriptionLike(text: string) {
    const params: RequestParams.Search = {
      index: "models",
      body: {
        query: {
          match_phrase: {
            description: text,
          },
        },
      },
    };
    const apiResult = await this.client.search(params);
    const hitsModelIds = apiResult.body.hits.hits.map((hit: any) => hit._id);
    return hitsModelIds;
  }
  public async getModelById(modelId: ModelId): Promise<Model | undefined> {
    const params: RequestParams.Get = {
      index: "models",
      id: modelId,
    };
    try {
      const apiResult = await this.client.get(params);
      const model = apiResult.body.found ? apiResult.body._source : undefined;
      return model;
    } catch (error) {
      console.log("Elastic get error ", error);
      return;
    }
  }
  public async removeAllModels() {
    this.client.deleteByQuery(
      {
        index: "models",
        refresh: true,
        body: {
          query: { match_all: {} },
        },
      },
      () => {
        return;
      }
    );
  }
}
