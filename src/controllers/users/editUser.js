const getDB = require("../../database/db");

const editUser = async (req, res) => {
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
    console.log(oldPwd);
    if (oldPwd.length === 0) {
      console.log("soy oldpwd");
      return res
        .status(401)
        .send({ message: "No coincide la contraseña con la actual" });
    }
    console.log("entro aca");

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
    console.log(error);
  }
};

module.exports = editUser;
