import { Clone } from "nodegit";
import axios from "axios";
import * as fs from "fs";
import { SingleBar, Presets } from "cli-progress";

export type Model = {
  modelId: string;
  private: boolean;
  key?: string;
};

const cloneBatchOfRepos = async (models: Model[], clonePath: string) => {
  const bar = new SingleBar({}, Presets.shades_classic);
  bar.start(models.length, 0);
  Promise.all(
    models.map(({ modelId }) => {
      Clone.clone(
        `https://huggingface.co/${modelId}`,
        `${clonePath}/${modelId}`
      )
        .then(() => {
          bar.increment();
        })
        .catch((error) => console.log(`Error for ${modelId}: `, error));
    })
  );
};

const batch = <T>(array: T[], size: number) =>
  array.reduce(
    (acc, e, i) => (
      i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc
    ),
    [] as Array<T[]>
  );

type CloneAllReposParams = {
  clonePath: string;
  maxNumberToClone: number;
  batchSize: number;
};
const cloneAllRepos = async ({
  clonePath,
  maxNumberToClone,
  batchSize,
}: CloneAllReposParams) => {
  const response = await axios.get("https://huggingface.co/api/models");

  const models: Model[] = response.data;
  const N = maxNumberToClone;
  console.log(
    `Will clone ${N} models out of ${models.length}, by batches of ${batchSize}`
  );
  batch(models, batchSize).map(async (modelsBatch) => {
    cloneBatchOfRepos(modelsBatch, clonePath);
  });
};

// Eventually remove local folder and create empty
const clonePath = "./HuggingFaceRepos";
fs.rmdirSync(clonePath, { recursive: true });
fs.mkdirSync(clonePath, { recursive: true });

cloneAllRepos({ clonePath, maxNumberToClone: 1000, batchSize: 100 });
