const path = require("path");
const sharp = require("sharp");
const uuid = require("uuid");
const {UPLOADS_DIRECTORY} = require('../config');


const saveAvatar = async (dataAvatar, dir) => {
  const img = sharp(dataAvatar.data).resize(200);

  const avatarNameUniq = `${uuid.v4()}_${dataAvatar.name}`;

  await img.toFile(
    path.join(__dirname, UPLOADS_DIRECTORY + dir, avatarNameUniq)
  );
  return avatarNameUniq;
};

module.exports = saveAvatar;
