const getDB = require("../../database/db");
const savePhoto = require("../../service/savePhoto");
const fs = require("fs/promises");
const path = require("path");

const addPhoto = async (req, res) => {
  try {
    const connect = await getDB();
    const { place, description } = req.body;
    const idUser = req.userInfo.id;

    if (!description) {
      return res
        .status(400)
        .send({ status: "Error", message: "Campo descripción es obligatorio" });
    }

    //hacemos un post a una entrada
    const [result] = await connect.query(
      `
            INSERT INTO entries (place,description,user_id)
            VALUES (?,?,?)
        `,
      [place, description, idUser]
    );
    const { insertId } = result;

    const photoFolder = path.resolve(__dirname, "../../uploads/photos");

    const createFolderUser = async () => {
      try {
        await fs.access(`${photoFolder}/${idUser}`);
      } catch (error) {
        await fs.mkdir(`${photoFolder}/${idUser}`);
      }
    };

    if (req.files && req.files.photo) {
      createFolderUser();
      const photo = await savePhoto(req.files.photo, `/photos/${idUser}`);

      await connect.query(
        `
        INSERT INTO photos (photo,entry_id)
        VALUES(?,?)
        `,
        [photo, insertId]
      );
      return res.status(200).send({
        status: "OK",
        message: "La imagen se cargó correctamente",
      });
    }
  } catch (error) {
    ext(error);
  }
};
module.exports = addPhoto;
