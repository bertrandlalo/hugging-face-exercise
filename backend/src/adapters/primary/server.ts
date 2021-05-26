import express, { Router } from "express";
import { getUsecases } from "./config";
import bodyParser from "body-parser";
import { sendHttpResponse } from "./helpers/sendHttpResponse";
import cors from "cors";
import { SearchModelParams } from "../../domain/git/useCases/SearchModels";
import axios from "axios";

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

router.route("/updateReadme").post(async (req, res) => {
  console.log("req.body", req.body);
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

// This is just a workaround to allow request from front (avoid CORS blockage)
const getWithCors = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};
router.route("/getWithCors").get(async (req, res) =>
  sendHttpResponse(res, () => {
    const params = req.query as { url: string }; // TODO : use Yup and validationSchema instead of this ugly `as`.
    return getWithCors(params.url);
  })
);

app.use(router);

export { app };
