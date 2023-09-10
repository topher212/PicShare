const getDB = require("../../database/db");

const searchUsers = async (req, res, next) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).send({ error: "Falta el nombre de usuario." });
  }

  const searchQuery = `%${username}%`;
  try {
    const connect = await getDB();
    const query = `
        SELECT username, avatar, name, id as idUser
        FROM users
        WHERE username LIKE ?;
      `;

    const [users] = await connect.query(query, [searchQuery]);
    connect.release();
    if (users.length === 0) {
      return res.status(404).send({ message: "No se encontraron usuarios." });
    }

    await res.status(200).send({
      status: "Ok",
      message: "Usuarios encontrados con éxito.",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = searchUsers;
