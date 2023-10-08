const path = require("path");
const sharp = require("sharp"); //para imagenes
const uuid = require("uuid");
const {UPLOADS_DIRECTORY} = require('../config');


const savePhoto = async (dataPhoto, dir) => {
  const img = sharp(dataPhoto.data).resize(600); //desbufferiza

  //instalamos uuid para generar un id unico para las imagenes -->npm i uuid
  //encriptado
  const photoNameUniq = `${uuid.v4()}_${dataPhoto.name}`;

  //guardamos archivo
  await img.toFile(
    path.join(__dirname, UPLOADS_DIRECTORY + dir, photoNameUniq)
  );
  return photoNameUniq;
};

module.exports = savePhoto;
