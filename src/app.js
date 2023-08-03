const express = require("express");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const path = require("path");

const server = express();

const createStaticDir = require("../src/service/createStaticDir");

const userRouter = require("../src/router/userRouter");

const entryRouter = require("../src/router/entryRouter");

const seePhotoUsers = require("../src/controllers/entries/seePhotoUsers");

server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(morgan("dev"));
server.use(fileupload());

const staticDir = path.join(__dirname, "uploads");
server.use(express.static(staticDir));
createStaticDir(staticDir);

server.get("/", seePhotoUsers);

server.use(userRouter);
server.use(entryRouter);


server.get('*', (_req, res) => {
    res.status(404).send('Error 404: Página no encontrada')
});


server.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
