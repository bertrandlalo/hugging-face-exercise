import express, { Router } from "express";
import { getUsecases } from "./config";
import bodyParser from "body-parser";
import { sendHttpResponse } from "./helpers/sendHttpResponse";
import cors from "cors";

const app = express();
app.use(cors());
const router = Router();

app.use(bodyParser.json());

router.route("/").get((req, res) => {
  return res.json({ message: "Hello World !" });
});

const useCases = getUsecases();

router.route("/fetchAll").get(async (req, res) => {
  console.log("req.body: ", req.body);
  return sendHttpResponse(res, () =>
    useCases.fetchAllModelsFromAPI.execute(req.body)
  );
});
router
  .route("/getUsers")
  .get(async (req, res) =>
    sendHttpResponse(res, () => useCases.getUsers.execute())
  );
router.route("/search").get(async (req, res) => {
  console.log(req.body);
  return sendHttpResponse(res, () => useCases.searchModels.execute(req.body));
});

app.use(router);

export { app };
