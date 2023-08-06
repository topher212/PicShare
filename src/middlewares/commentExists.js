const getDB = require("../database/db");

const commentExists = async (req, res, next) => {
  try {
    const connect = await getDB();

    const { idComment, idEntry } = req.params;

    const [comment] = await connect.query(
      `SELECT id 
             FROM comments 
             WHERE id = ? AND entry_id = ?`,
      [idComment, idEntry]
    );

    connect.release();

    if (comment.length === 0) {
      return res
        .status(404)
        .send({ status: 404, message: "No existe ese comentario." });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = commentExists;
