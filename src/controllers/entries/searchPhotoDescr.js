const getDB = require("../../database/db");
const fs = require("fs/promises");
const path = require("path");

const searchPhotoDescr = async (req, res) => {
  const { description } = req.query;

  if (!description) {
    return res.status(400).send({ error: 'Falta el parámetro "description".' });
  }

  const searchQuery = `%${description}%`;

  try {
    const connect = await getDB();
    const query = `
        SELECT photos.photo, entries.description, photos.entry_id as idEntry
        FROM photos
        JOIN entries ON photos.entry_id = entries.id
        WHERE entries.description LIKE ?;
      `;

    const [namePhoto] = await connect.query(query, [searchQuery]);
    connect.release();

    if (namePhoto.length === 0) {
      return res.status(404).send({ message: "No se encontraron fotos." });
    }

    const imagePaths = namePhoto.map((photoN) =>
      path.join(__dirname, "../../uploads/photos", photoN.photo)
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
      if (user.idEntry === total[0].idEntry) {
        user["likes"] = total[0].likes;
      } else {
        user["likes"] = 0;
      }
    });

    Promise.all(photoPromise).then(async () => {
      await res.status(200).send({
        status: "Ok",
        message: "Fotos encontradas con éxito.",
        photos: namePhoto,
        imagePaths,
      });
    });
  } catch (error) {
    console.error("Error al buscar las fotos:", error);
    return res.status(500).send({ error: "Error al buscar las fotos." });
  }
};

module.exports = searchPhotoDescr;
