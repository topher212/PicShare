const hapiJoi = require("@hapi/joi");

const validatorInfoUser = (req, res, next) => {
  try {
    if (
      (req.body.email && req.body.pwd && req.body.name) ||
      (req.body.email && req.body.pwd && req.body.name && req.body.pwdNew)
    ) {
      const userData = req.body;

      const schema = hapiJoi.object().keys({
        email: hapiJoi
          .string()
          .email()
          .message("Email debe tener un formato válido")
          .required(),
        pwd: hapiJoi
          .string()
          .min(6)
          .message("La contraseña debe tener mínimo 6 caracteres")
          .max(20)
          .message("La contraseña debe tener máximo 20 caracteres")
          .alphanum()
          .message("Permite alfa")
          .required(),
        name: hapiJoi
          .string()
          .min(5)
          .message("El nombre debe tener mínimo 5 caracteres")
          .max(15)
          .message("El nombre debe tener máximo 15 caracteres")
          .required(),
        pwdNew: hapiJoi
          .string()
          .min(6)
          .message("La nueva contraseña debe tener mínimo 6 caracteres")
          .max(20)
          .message("La nueva contraseña debe tener máximo 20 caracteres")
          .alphanum()
          .message("Permite alfa"),
      });

      const validation = schema.validate(userData);

      if (validation.error) {
        return res
          .status(403)
          .send({ status: "Error", message: validation.error.message });
      }
    }

    if (!req.body.email || !req.body.pwd || !req.body.name) {
      return res.send({ status: "Error", message: "Me faltan campos" });
    }

    if (parseInt(req.body.name) || /\d/.test(req.body.name)) {
      return res.send({
        status: "Error",
        message: "Campo nombre no permite números",
      });
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = validatorInfoUser;
