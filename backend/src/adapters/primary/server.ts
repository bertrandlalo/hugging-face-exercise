import express, { Router } from "express";
import { getUsecases } from "./config";
import bodyParser from "body-parser";
import { sendHttpResponse } from "./helpers/sendHttpResponse";
import cors from "cors";
import { SearchModelParams } from "../../domain/git/useCases/SearchModels";
import { ModelId } from "../../domain/git/entities/Model";

const app = express();
app.use(cors());
const router = Router();

app.use(bodyParser.json());

const useCases = getUsecases();

router.route("/fetchAll").get(async (req, res) => {
  return sendHttpResponse(res, () =>
    useCases.fetchAllModelsFromAPI.execute(req.query)
  );
});

const eventuallyFetchModelAndGetReadme = async ({
  modelId,
}: {
  modelId: ModelId;
}): Promise<string | undefined | null> => {
  console.log("eventuallyFetchModelAndGetReadme ", modelId);
  let readmeContent = await useCases.getReadmeFromRepo.execute({ modelId });
  // TODO / Note to self or reviewer : Not so proud of how I handle mistake, playing with null... Refactoring needed !
  if (readmeContent === null) {
    // Model has not been fetched yet ... Fetch it and get Readme.
    const models = await useCases.fetchAllModelsFromAPI.execute({
      matchingModelId: [modelId],
    });
    const model = models.pop();
    if (!model) {
      throw new Error(`Could not fetch model ${modelId}`);
    }
    readmeContent = model.description;
  }
  return readmeContent;
};

router.route("/eventuallyFetchModelAndGetReadme").get(async (req, res) => {
  return sendHttpResponse(
    res,
    () => eventuallyFetchModelAndGetReadme(req.query as { modelId: ModelId }) // TODO : use Yup and validationSchema instead of this ugly `as`.
  );
});

router.route("/updateReadme").post(async (req, res) => {
  return sendHttpResponse(res, () => useCases.updateModel.execute(req.body));
});

router
  .route("/getAllModelIdsFromAPI")
  .get(async (req, res) =>
    sendHttpResponse(res, () => useCases.getAllModelIdsFromAPI.execute())
  );

router.route("/search").get(async (req, res) => {
  const params = req.query as SearchModelParams; // TODO : use Yup and validationSchema instead of this ugly `as`.
  return sendHttpResponse(res, () => useCases.searchModels.execute(params));
});

app.use(router);

export { app };
