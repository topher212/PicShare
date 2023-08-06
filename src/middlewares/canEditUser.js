const getDB = require("../database/db");

const canEditUser = async (req, res, next) => {
  try {
    const connect = await getDB();
    const { idUser } = req.params;

    const [user] = await connect.query(
      `SELECT id
             FROM users
             WHERE id = ?`,
      [idUser]
    );

    connect.release();
    if (req.userInfo.id !== user[0].id) {
      return res
        .status(401)
        .send({
          status: 401,
          message: "No tienes permisos para modificar este usuario",
        });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = canEditUser;
