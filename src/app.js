const express = require("express");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const path = require("path");

const server = express();

const createStaticDir = require("../src/service/createStaticDir");

const userRouter = require("../src/router/userRouter");

const entryRouter = require("../src/router/entryRouter");

server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(morgan("dev"));
server.use(fileupload());

const staticDir = path.join(__dirname, "uploads");
server.use(express.static(staticDir));
createStaticDir(staticDir);

server.get("/", (req, res) => {
  res.send("<h3>Estoy aca</h3>");
});

server.use(userRouter);
server.use(entryRouter);

server.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
