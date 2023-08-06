const path = require("path");
const sharp = require("sharp");
const uuid = require("uuid");

const saveAvatar = async (dataAvatar, dir) => {
  const img = sharp(dataAvatar.data).resize(200);

  const avatarNameUniq = `${uuid.v4()}_${dataAvatar.name}`;

  await img.toFile(
    path.join(__dirname, process.env.UPLOADS_DIRECTORY + dir, avatarNameUniq)
  );
  return avatarNameUniq;
};

module.exports = saveAvatar;
