const getDB = require("../../database/db");

const postUser = async (req, res, next) => {
  try {
    const { email, name, pwd } = req.body;
    const connect = await getDB();

    const [userExist] = await connect.query(
      `SELECT id FROM users WHERE email=?`,
      [email]
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
          message: "Tu usuario ha sido recuperado",
        });
      }
      connect.release();
      return res.status(409).send({
        status: "ERROR",
        message: "El usuario ya existe",
      });
    }

    const [users] = await connect.query(
      `INSERT INTO users (email, name, password) VALUES (?,?,SHA2(?,512))`,
      [email, name, pwd]
    );

    connect.release();

    res.status(200).send({
      status: "OK",
      message: "Usuario creado correctamente",
      newUser: {
        userName: name,
        userEmail: email,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = postUser;
