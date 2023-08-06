const getDB = require("../../database/db");

const editUser = async (req, res, next) => {
  try {
    const idUser = req.userInfo.id;
    const { email, name, pwd, pwdNew } = req.body;

    const connect = await getDB();
    const [user] = await connect.query(
      `
      SELECT id, email, name FROM users WHERE id=?
      `,
      [idUser]
    );

    const [oldPwd] = await connect.query(
      `
      SELECT id FROM users 
      WHERE id=? AND password=SHA2(?,512)
      `,
      [idUser, pwd]
    );
    if (oldPwd.length === 0) {
      return res
        .status(401)
        .send({
          status: 401,
          message: "No coincide la contraseña con la actual",
        });
    }

    if (email && email !== user[0].email) {
      const [existingEmail] = await connect.query(
        `
        SELECT id
        FROM users
        WHERE email=?
        `,
        [email]
      );
      if (existingEmail.length > 0) {
        return res.status(409).send({
          status: "ERROR",
          message:
            "Ya existe un usuario registrado con ese email. Usa otro email",
        });
      }
      await connect.query(
        `
        UPDATE users
        SET email = ?, name=?, lastAuthUpdate = ?
        WHERE id = ?
        `,
        [email, name, new Date(), idUser]
      );
    }
    if (email && email === user[0].email) {
      await connect.query(
        `
        UPDATE users
        SET name=?
        WHERE id = ?
        `,
        [name, idUser]
      );
    }

    if (pwdNew) {
      await connect.query(
        `
        UPDATE users 
        SET password = SHA2(?,512), lastAuthUpdate=?
        WHERE id=?
        `,
        [pwdNew, new Date(), idUser]
      );
    }

    connect.release();

    return res.status(200).send({
      status: "OK",
      message: "Usuario modificado correctamente",
      newUser: {
        name: name,
        email: email,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = editUser;
