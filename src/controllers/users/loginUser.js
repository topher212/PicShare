const getDB = require("../../database/db");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res, next) => {
  try {
    const connect = await getDB();

    const { email, pwd } = req.body;

    if (!email || !pwd) {
      return res.status(400).send({ status: "Error", message: "Faltan datos" });
    }

    //comprobar que el usuario exista y que la pwd sea correcta y corresponda a ese mail
    const [user] = await connect.query(
      `
                SELECT id, role, active
                FROM users
                WHERE email = ? AND password = SHA2(?,512)
            `,
      [email, pwd]
    );

    if (!user.length) {
      connect.release();
      return res.status(400).send({
        status: "ERROR",
        message: "Usuario o Contraseña incorrecta. Vuelve a introducirla.",
      });
    }

    //jsonwebtoken
    //body
    const info = {
      id: user[0].id,
      role: user[0].role,
    };

    //generar el token con el metodo sign el cual recibe como argumentos
    //un obj con la info (body o payload), palabra secreta (.env.SECRET_TOKEN)
    //un vencimiento 1d, 30m, 60m 10d 60d
    const token = jwt.sign(info, process.env.SECRET_TOKEN, { expiresIn: "1d" });

    await connect.query(
      `
      UPDATE users 
      SET active = 1 
      WHERE id=?
      `,
      [user[0].id]
    );

    connect.release();

    jwt.verify(token, process.env.SECRET_TOKEN, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ error: "Token inválido o expirado" });
      } else {
        const userData = decodedToken;

        res.status(200).send({
          status: "OK",
          message: "Login correcto",
          data: {
            token,
            idUser: info.id,
            role: info.role,
          },
        });
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = loginUser;
