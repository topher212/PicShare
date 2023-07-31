const express = require('express');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const path = require('path');

const server = express();

server.use(express.urlencoded({extended: false}));
server.use(express.json());
server.use(morgan('dev'));
server.use(fileupload());

server.get('/', (req, res) => {
    res.send('<h3>Estoy aca</h3>');
});

server.use(userRouter);
//server.use(entryRouter);

server.use((err, _req, res, _next) => {
    const status = err.status || 500;
    const message = err.message || err;
    console.error(err);
    res.status(status).send(message);
});


module.exports = server;