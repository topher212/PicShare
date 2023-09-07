const express = require("express");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const path = require("path");
const cors = require('cors');

const server = express();

const createStaticDir = require("../src/service/createStaticDir");

const userRouter = require("../src/router/userRouter");

const entryRouter = require("../src/router/entryRouter");

const seePhotoUsers = require("../src/controllers/entries/seePhotoUsers");

const corsOptions = {
  origin: 'http://localhost:5173', 
};

server.use(cors(corsOptions)); 

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

server.use((req, res, next) => {
  res
    .status(404)
    .send({ status: "Error 404:", message: "Página no encontrada" });
  next();
});

server.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res
    .status(status)
    .send({ status: status, message: message, stack: err.stack });
});

module.exports = server;
