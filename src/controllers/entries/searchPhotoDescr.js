const getDB = require("../../database/db");
const fs = require("fs/promises");
const path = require("path");

const searchPhotoDescr = async (req, res, next) => {
  const { description } = req.query;

  if (!description) {
    return res.status(400).send({ error: 'Falta el parámetro "description".' });
  }

  const searchQuery = `%${description}%`;

  try {
    const connect = await getDB();
    const query = `
        SELECT photos.photo, entries.description, photos.entry_id as idEntry, users.username as username, entries.user_id as idUser
        FROM photos
        JOIN entries ON photos.entry_id = entries.id
        JOIN users ON entries.user_id = users.id 
        WHERE entries.description LIKE ?;
      `;

    const [namePhoto] = await connect.query(query, [searchQuery]);
    connect.release();
    if (namePhoto.length === 0) {
      return res.status(404).send({ message: "No se encontraron fotos." });
    }

    const imagePaths = namePhoto.map((photoN) =>
      path.join(
        __dirname,
        "../../uploads/photos",
        photoN.idUser.toString(),
        photoN.photo
      )
    );
    const photoPromise = namePhoto.map(async (user) => {
      const [total] = await connect.query(
        `
      SELECT  COUNT(*) as likes, e.id as idEntry
      FROM entries e
      JOIN likes l ON l.entry_id = e.id
      WHERE entry_id=?
    `,
        [user.idEntry]
      );
      const [comments] = await connect.query(
        `SELECT c.comment, c.user_id, c.date, c.edit_date, u.username as username
        FROM comments c 
        JOIN users u ON c.user_id = u.id 
        WHERE entry_id=?
        `,
        [user.idEntry]
      );
      user["comments"] = comments;

      if (!user["comments"].length) {
        user["comments"] = "No hay comentarios en esta publicación";
      }
    });

    await Promise.all(photoPromise).then(async () => {
      await res.status(200).send({
        status: "Ok",
        message: "Fotos encontradas con éxito.",
        photos: namePhoto,
        imagePaths,
      });
    });
  } catch (error) {
    next(error);
  }
};

module.exports = searchPhotoDescr;
