const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;
  const repository = { id: uuid(), url, title, techs, likes: 0 };
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const repositoryIndex = findById(request, response);
  const { url, title, techs } = request.body;

  if (request.body.likes) {
    return response.json({
      likes: 0
    });
  }

  const repository = {
    id: repositories[repositoryIndex].id,
    url,
    title,
    techs
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const repositoryIndex = findById(request, response);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const repositoryIndex = findById(request, response);

  const addedLikes = (repositories[repositoryIndex].likes) + 1;

  const repository = {
    id: repositories[repositoryIndex].id,
    likes: addedLikes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

function findById(request, response) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => id === repository.id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  return repositoryIndex;
}

module.exports = app;
