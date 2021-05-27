# Hugging Face Exercise 

<img src="https://github.com/bertrandlalo/hugging-face-exercise/actions/workflows/main.yml/badge.svg">

![demo GIF](demo.gif)

## Requirements

* [Docker](https://docs.docker.com/get-docker/) (If you want to launch the app with Elastic-Search)
* [Node.js](https://nodejs.org/) (this sample tested with 10.x)
* [Git](https://git-scm.com/downloads)
## Install
You need node 14+ to use the app. 
### Launch backend


```
cd backend
npm install 
npm run start:json
```

=> To launch the app with Elastic-Search instead of JSON as a models repository and search engine, see [backend README](backend/README.md) 

### Launch frontend
See [frontend README](frontend/README.md)

```
cd frontend
npm install 
npm run start
```

