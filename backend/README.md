# Hugging-Face exercise : Model Search Engine (Backend)

## Description

## Requirements

* [Docker](https://docs.docker.com/get-docker/)
* [Node.js](https://nodejs.org/) (this sample tested with 10.x)
* [Git](https://git-scm.com/downloads)
## Install

You need node 14+ to use the app :
```
npm install
```

## To launch Elastic Search container 

To run the app with elastic-search or to run the integration tests, you'll need to expose an elastic-search server on localhost:9200. You can do this using docker. 
Pull Elastic Search Image and start the container : 

```
docker pull docker.elastic.co/elasticsearch/elasticsearch:7.13.0 to bring image down to local computer
docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.13.0
```

## Test the app 
Make sure you have elastic-search running to launch all tests (or some will fail)
```
npm run test:all
```

You can run in watch mode individually :
Unit tests :

```
npm run test:unit
```

Integration tests :
Make sure you have elastic-search running to launch integration tests (or some will fail)

```
npm run test:integration
```

End to end tests :

```
npm run test:e2e
```

## Start the app 

### To start with IN_MEMORY database :

```
npm start
```

### To start with JSON database :

```
npm run start:json
```

### To start with ELASTIC SEARCH database:

Make sure you have elastic-search running to launch the app with a elastic model repo.

Then launch the app : 

```
npm run start:elastic
```
