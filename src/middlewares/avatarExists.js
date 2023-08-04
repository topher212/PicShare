const getDB = require("../database/db");

const avatarExists = async (req, res, next) => {
  try {
    const connect = await getDB();
    const idUser = req.userInfo.id;

    const [user] = await connect.query(
      `SELECT avatar FROM users WHERE id = ?`,
      [idUser]
    );

    if (user[0].avatar) {
      return res.status(409).send("El usuario ya tiene un avatar");
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error al verificar el avatar del usuario");
  }
};

module.exports = avatarExists;
