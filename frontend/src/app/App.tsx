import React, { useEffect, useState } from "react";
import {
  Container,
  TextareaAutosize,
  TextField,
  Typography,
} from "@material-ui/core";
import "./App.css";
import axios from "axios";
import { UiButton } from "../components/UiButton";
import { Autocomplete } from "@material-ui/lab";
import { v4 as uuidv4 } from "uuid";
import MultiSelect from "react-multi-select-component";

export const App = () => {
  type Option = { label: string; value: string };
  const userOptions = [
    { label: "amazon", value: "amazon" },
    { label: "allenai", value: "allenai" },
    { label: "etalab-ia", value: "etalab-ia" },
    { label: "facebook", value: "facebook" },
    { label: "google", value: "google" },
    { label: "microsoft", value: "microsoft" },
    { label: "RaphBL", value: "RaphBL" },
  ];

  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [usersToFetch, setUsersToFetch] = useState(
    undefined as Option[] | undefined
  );

  const [searchQuery, setSearchQuery] = useState("NLP");
  const [searchResult, setSearchResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [modelIdToUpdateReadmeFrom, setModelIdToUpdateReadmeFrom] = useState(
    undefined as string | undefined
  );

  const [modelOptions, setModelOptions] = useState([] as Option[]);
  const [readmeContent, setReadmeContent] = useState("");

  const limitNumberOfModels = 200;

  useEffect(() => {
    getAllModelIdsFromAPI();
  }, []);

  const fetchAllModelsFromAPI = async () => {
    const fromUsers = usersToFetch
      ? usersToFetch.map(({ value }) => value)
      : undefined;

    setIsFetchingModels(true);

    axios({
      method: "get",
      url: "http://localhost:8080/fetchAll",
      params: { matchingModelId: fromUsers, limitNumberOfModels },
    }).then(function (response) {
      setIsFetchingModels(false);
    });
  };

  const getAllModelIdsFromAPI = () => {
    axios({
      method: "get",
      url: "http://localhost:8080/getAllModelIdsFromAPI",
    }).then(function (response) {
      setModelOptions(
        response.data.map((modelId: string) => ({
          value: modelId,
          label: modelId,
        }))
      );
    });
  };

  const scrapReadmeForModelId = (modelId: string) => {
    axios({
      method: "get",
      url: `http://localhost:8080/eventuallyFetchModelAndGetReadme`,
      params: { modelId },
    })
      .then(function (response) {
        console.log(response.data);
        setReadmeContent(response.data);
      })
      .catch(function (error) {
        setReadmeContent(
          `Could not fetch README from model ${modelId}:\n${error}`
        );
      });
  };

  const getModelWithMatchingDescription = () => {
    setIsSearching(true);
    axios({
      method: "get",
      url: "http://localhost:8080/search",
      params: { query: searchQuery },
    }).then(function (response) {
      console.log(response.data);
      setSearchResult(response.data);
    });
    setIsSearching(false);
  };

  const publishNewReadme = () => {
    console.log(readmeContent);
    console.log(modelIdToUpdateReadmeFrom);
    const commitId = uuidv4();
    axios({
      method: "post",
      url: "http://localhost:8080/updateReadme",
      data: {
        commit: {
          commitId: commitId,
          fileUpdates: [
            {
              name: "README.md",
              content: readmeContent,
              kind: "changed",
            },
          ],
          date: new Date(),
          modelId: modelIdToUpdateReadmeFrom,
        },
      },
    }).then(function (response) {
      console.log(setReadmeContent(""));
    });
  };

  return (
    <div className="App">
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h3" style={{ marginBottom: "12px" }}>
          Model Search Engine
        </Typography>
        <div style={{ display: "flex" }}>
          <Container style={{ minWidth: "500px", margin: "32px" }}>
            <Typography variant="h4">LFS / Hub syncro</Typography>
            <Typography variant="h6">
              Initial fetch of models from API
            </Typography>
            <MultiSelect
              options={userOptions}
              value={usersToFetch ?? []}
              onChange={setUsersToFetch}
              labelledBy="Select users to fetch models from"
            />
            <UiButton
              isLoading={isFetchingModels}
              onClick={fetchAllModelsFromAPI}
            >
              Initialize DB with models from{" "}
              {usersToFetch ? usersToFetch.length : "all"} users (limit to{" "}
              {limitNumberOfModels} models)
            </UiButton>
            <Typography variant="h6">Mimic a change on a model repo</Typography>
            <Autocomplete
              options={modelOptions}
              getOptionLabel={(option: Option) => option.label}
              style={{ width: 300 }}
              onChange={(event, selectedOption) => {
                const modelId = selectedOption?.value;
                setModelIdToUpdateReadmeFrom(selectedOption?.value);
                if (!!modelId) {
                  scrapReadmeForModelId(modelId);
                }
              }}
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  label="ModelId (repo)"
                  variant="outlined"
                />
              )}
            />
            <TextareaAutosize
              placeholder="README.md content"
              style={{ marginBlock: 12, width: "100%" }}
              rowsMin={30}
              rowsMax={30}
              value={readmeContent}
              onChange={(evt) => {
                setReadmeContent(evt.target.value);
              }}
            />
            <UiButton onClick={publishNewReadme}>
              Publish (commit & push)
            </UiButton>
          </Container>

          <Container style={{ minWidth: "500px", margin: "32px" }}>
            <Typography variant="h4">Search Engine</Typography>
            <Typography variant="h6">
              Search model with matching description
            </Typography>

            <TextField
              style={{ marginBlock: "12px" }}
              label="Query"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
            <UiButton
              isLoading={isSearching}
              onClick={getModelWithMatchingDescription}
            >
              Search
            </UiButton>
            <div>
              Found {searchResult.length} models with matching description :{" "}
            </div>
            <div>
              {searchResult.map((modelId: string) => (
                <div>→ {modelId}</div>
              ))}
            </div>
          </Container>
        </div>
      </Container>
    </div>
  );
};
