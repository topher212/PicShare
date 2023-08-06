const getDB = require("../database/db");

const canEditEntry = async (req, res, next) => {
  try {
    const connect = await getDB();
    const { idEntry } = req.params;

    const [entry] = await connect.query(
      `SELECT user_id
             FROM entries
             WHERE id = ?`,
      [idEntry]
    );

    connect.release();

    if (req.userInfo.id !== entry[0].user_id && req.userInfo.role !== "admin") {
      return res
        .status(401)
        .send({
          status: 401,
          message: "No tiene permisos para modificar esta publicación",
        });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = canEditEntry;
