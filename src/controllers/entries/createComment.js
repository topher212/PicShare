const getDB = require("../../database/db");

const createComment = async (req, res, next) => {
  try {
    const connect = await getDB();
    const { idEntry } = req.params;
    const idUser = req.userInfo.id;

    const { comment } = req.body;
    if (!comment) {
      return res.status(400).send("El campo comentario es obligatorio");
    }

    await connect.query(
      `INSERT INTO comments (comment, user_id, entry_id)
             VALUES (?, ?, ?)`,
      [comment, idUser, idEntry]
    );

    connect.release();

    res.status(200).send({
      status: "OK",
      message: "Publicación comentada correctamente.",
      data: {
        idEntry: idEntry,
        comment: comment,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = createComment;
