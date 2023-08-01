const getDB = require("../../database/db");
const savePhoto = require("../../service/savePhoto");
const fs = require("fs/promises");
const path = require("path");


const addPhoto = async (req, res) => {
  try {
    const connect = await getDB();
    const { place, description, comment } = req.body;
    const { id_User } = req.params;
    if (!description) {
      return res.status(400).send("Campo descripción es obligatorio");
    }

    //hacemos un post a una entrada
    const [result] = await connect.query(
      `
            INSERT INTO entries (place,description,user_id,comment)
            VALUES (?,?,?,?)
        `,
      [place, description, id_User, comment]
    );
    const { insertId } = result;

    const photoFolder = path.resolve(__dirname, "../../uploads/photos");

    const createFolderUser = async () => {
      try {
        await fs.access(`${photoFolder}/${id_User}`);
        //await fs.access(`${staticDir}/avatarUser/${id_User}`);
      } catch (error) {
        //await fs.mkdir(`${staticDir}/avatarUser/${id_User}`);
        await fs.mkdir(`${photoFolder}/${id_User}`);
      }
    };

    if (req.files && req.files.photo) {
      createFolderUser();
      const photo = await savePhoto(req.files.photo, `/photos/${id_User}`);

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
    } else {
      return res.status(409).send("El envío de la imagen es obligatorio");
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = addPhoto;
