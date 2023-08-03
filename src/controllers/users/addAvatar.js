const getDB = require("../../database/db");
const saveAvatar = require("../../service/saveAvatar");
const fs = require("fs/promises");
const path = require("path");

const addAvatar = async (req, res) => {
  try {
    const connect = await getDB();
    const idUser = req.userInfo.id;

    const avatarFolder = path.resolve(__dirname, "../../uploads/avatarUser");

    const createFolderUser = async () => {
      try {
        await fs.access(`${avatarFolder}/${idUser}`);
      } catch (error) {
        await fs.mkdir(`${avatarFolder}/${idUser}`);
      }
    };

    if (req.files && req.files.avatar) {
      createFolderUser();
      const avatar = await saveAvatar(
        req.files.avatar,
        `/avatarUser/${idUser}`
      );

      await connect.query(`UPDATE users SET avatar = ? WHERE id = ?`, [
        avatar,
        idUser,
      ]);

      return res.status(200).send({
        status: "OK",
        message: "El avatar se cargó correctamente",
        avatar,
      });
    } else {
      return res.status(409).send("El envío del avatar es obligatorio");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error al agregar el avatar");
  }
};

module.exports = addAvatar;
