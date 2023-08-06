const getDB = require("../database/db");

const userExists = async (req, res, next) => {
  try {
    const connect = await getDB();
    const { idUser } = req.params;

    const [user] = await connect.query(
      `SELECT id
             FROM users
             WHERE id = ?`,
      [idUser]
    );

    if (user.length === 0) {
      return res
        .status(404)
        .send({ status: 404, message: "No existe el usuario" });
    }

    connect.release();

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = userExists;
