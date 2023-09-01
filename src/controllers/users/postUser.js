const getDB = require("../../database/db");

const postUser = async (req, res, next) => {
  try {
    const { email, name, username, pwd } = req.body;
    const connect = await getDB();

    const [userExist] = await connect.query(
      `SELECT id FROM users WHERE email=? OR username = ?`,
      [email, username]
    );

    if (userExist.length > 0) {
      const deleteUserToRocover = await connect.query(
        `SELECT id FROM users WHERE deleted = 1 AND email=?`,
        [email]
      );
      if (deleteUserToRocover[0].length > 0) {
        await connect.query(
          `
        UPDATE users
          SET name=?, lastAuthUpdate = ?, password=SHA2(?,512), deleted=0
          WHERE id = ?
        `,
          [name, new Date(), pwd, deleteUserToRocover[0][0].id]
        );
        return res.status(200).send({
          status: "OK",
          message: "Tu usuario ha sido recuperado con éxito",
        });
      }
      connect.release();
      return res.status(409).send({
        status: "ERROR",
        message: "El usuario ya existe",
      });
    }

    const [users] = await connect.query(
      `INSERT INTO users (email, username, name, password) VALUES (?,?,?,SHA2(?,512))`,
      [email, username, name, pwd]
    );

    connect.release();

    res.status(200).send({
      status: "OK",
      message: "Usuario creado correctamente",
      newUser: {
        name: name,
        email: email,
        username: username,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = postUser;
