const getDB = require("../../database/db");
const fs = require("fs/promises");
const path = require("path");

const deleteEntry = async (req, res, next) => {
  try {
    const connect = await getDB();
    const { idEntry } = req.params;
    const [idUser] = await connect.query(
      `
        SELECT u.id 
        FROM users u
        JOIN entries e ON e.user_id=u.id
        WHERE e.id = ?
        `,
      [idEntry]
    );

    // borrar posibles comentarios que tenga la publicación
    await connect.query(
      `DELETE FROM comments 
      WHERE entry_id = ?`,
      [idEntry]
    );

    // Seleccionar las fotos asociadas a la publicación
    const [photos] = await connect.query(
      `SELECT photo
                 FROM photos
                 WHERE entry_id = ?`,
      [idEntry]
    );

    // borrar las fotos de la publicación en la tabla photos
    await connect.query(
      `DELETE FROM photos
                   WHERE entry_id = ?`,
      [idEntry]
    );

    // eliminar las fotos de la carpeta del usuario
    const photoToDelete = path.resolve(__dirname, "../../uploads/photos");
    await fs.unlink(`${photoToDelete}/${idUser[0].id}/${photos[0].photo}`);

    // borrar posibles votos que tenga la publicación
    await connect.query(
      `DELETE FROM likes 
                     WHERE entry_id = ?`,
      [idEntry]
    );

    // eliminar la entrada de la db
    await connect.query(
      `DELETE FROM entries
             WHERE id = ?`,
      [idEntry]
    );

    connect.release();

    res.status(200).send([
      {
        status: "OK",
        message: `La publicación con id ${idEntry} y sus elementos fueron eliminados.`,
      },
    ]);

  } catch (error) {
    next(error);
  }
};

module.exports = deleteEntry;