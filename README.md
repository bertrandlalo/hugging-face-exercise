# Hugging Face Exercise 
<img src="https://github.com/bertrandlalo/hugging-face-exercise/actions/workflows/main.yml/badge.svg">

## Description
This exercise’s goal was to build a basic text search API on top of Hugging-Face git repos. 
The backend of the application is designed following a clean (hexagonal) architecture, that allows one to clearly separate the business logic (domain : use cases and ports) from the implementations (external services => adapters). 
Nice things with such an organization are : 
  - it's easy to test 
  - we're not coupled/married with any service (ie. db, search engine, event-bus, cache, ...)

### Demo
![demo GIF](demo.gif)

NB : I mimicked the publication of changes in README.md (left side of the app), to be able to demonstrate the actual search engine (right side of the app) being up to date. 

### Entities
- a [`Model`](backend/src/domain/git/entities/Model.ts) is Git repo. 
- a [`Commit`](backend/src/domain/git/entities/Commit.ts) is a change in a repo.

### Use-Cases

Use-Cases are all the application specific business rules gets divided into list of use cases, each having a single responsability.

The use-cases of this app can be described using events, as follow : 
  - When one user searches for models with description (ie. README) matching some key words : it should return a list of those models (eventually ordered by marching accuracy or popularity)  (described [here](backend/src/domain/git/useCases/SearchModels.unit.test.ts))
  - When one user publishes some new models : it should add this model to the searching candidates
  - When one  user publishes (commit & push) a new update to its model (especially if README.md file is affected), the local copy of the model should be updated. (described [here](backend/src/domain/git/useCases/UpdateModel.unit.test))


The use-cases are tested through unit tests. (`npm run test:unit`)

### Ports
Ports are the dependency API where we define how the application interacts with external "bricks". 

This little app has 3 ports (interfaces): 
  - [ModelRepository](backend/src/domain/git/ports/ModelRepository.ts) : to maintain a local copy of the models with their description. (could be implemented with ElasticSearch)
  - [HuggingFaceAPI](backend/src/domain/git/ports/HuggingFaceAPI.ts) : to initially fetch the models and their README from. 
  - [CommitRepository](backend/src/domain/git/ports/CommitRepository.ts) : to store each model update (keep history) (could be implemented with Mongo (?))

### Secondary adapters (external )
The Secondary adapters are the actual implementations of the ports. For example, the engine DB could be elastic, json, mongo, or anything. 

I implemented :
- For ModelRepository : 
  - [JsonModelRepository](backend/src/adapters/secondary/JsonModelRepository.ts) described [here](backend/src/adapters/secondary/JsonModelRepository.integration.test.ts) where the model are stored locally as a big record in a JSON file. 
  - [ElasticModelRepository](backend/src/adapters/secondary/ElasticModelRepository.integration.test.ts) described [here](backend/src/adapters/secondary/ElasticModelRepository.integration.test.ts) where the model are indexed in ElasticSearch. 

- For HuggingFaceAPI: 
  - [FakeHuggingFaceAPI](backend/src/adapters/secondary/FakeHuggingFaceAPI.ts) (for test purpose only)
  - [HttpHuggingFaceAPI](backend/src/adapters/secondary/HttpHuggingFaceAPI.ts) (described [here](backend/src/adapters/secondary/HttpHuggingFaceAPIintegration.test.ts))

The adapters are tested through integration tests. (`npm run test:integration`)
### Entrypoints
The routes in server are : 
#### Mimic the Hugging-Face Hub
- /fetchAll : to initialize the engine db with models (described [here](backend/src/adapters/primary/e2e-tests/fetchAll.e2e.test.ts))
- /eventuallyFetchModelAndGetReadme : to get the README content of a model we want to mimic an update from. 
- /updateReadme : to mimic the update of the README content of a model (described [here](backend/src/adapters/primary/e2e-tests/updateReadme.e2e.test.ts) )
- /getAllModelIdsFromAPI : to get all the model from HuggingFaceAPI

#### Actual Search Engine
- /search : to search models with description matching a text (described [here](backend/src/adapters/primary/e2e-tests/search.e2e.test.ts))

The routes are tested through e2e tests. (`npm run test:e2e`)

## Usage

### Requirements

* [Docker](https://docs.docker.com/get-docker/) (If you want to launch the app with Elastic-Search)
* [Node.js](https://nodejs.org/) (this sample tested with 10.x)
* [Git](https://git-scm.com/downloads)
### Install
You need node 14+ to use the app. 
#### Launch backend
See how to launch tests in [backend README](backend/README.md)

```
cd backend
npm install 
npm run start:json
```

=> To launch the app with Elastic-Search instead of JSON as a models repository and search engine, see [backend README](backend/README.md) 

#### Launch frontend
See [frontend README](frontend/README.md)

```
cd frontend
npm install 
npm run start
```

