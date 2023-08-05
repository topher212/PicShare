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
        .send("No tienes permisos para modificar este comentario");
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "ERROR",
      message: "Error en el servidor",
    });
  }
};

module.exports = canEditUser;
