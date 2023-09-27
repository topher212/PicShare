const hapiJoi = require("@hapi/joi");

const validatorInfoUser = (req, res, next) => {
  try {
    if (
      (req.body.email &&
        req.body.pwd &&
        req.body.repeatpwd &&
        req.body.name &&
        req.body.username) ||
      (req.body.email &&
        req.body.pwd &&
        req.body.repeatpwd &&
        req.body.name &&
        req.body.pwdNew)
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
          .max(30)
          .message("La contraseña debe tener máximo 30 caracteres")
          .alphanum()
          .message("Permite alfa")
          .required(),
        repeatpwd: hapiJoi.string(),
        name: hapiJoi
          .string()
          .min(5)
          .message("El nombre debe tener mínimo 5 caracteres")
          .required(),
        username: hapiJoi.string().required(),
        pwdNew: hapiJoi
          .string()
          .min(6)
          .message("La nueva contraseña debe tener mínimo 6 caracteres")
          .max(30)
          .message("La nueva contraseña debe tener máximo 30 caracteres")
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

    if (
      !req.body.email ||
      !req.body.pwd ||
      !req.body.name ||
      !req.body.username
    ) {
      return res.send({ status: "Error", message: "Me faltan campos" });
    }

    if (req.body.pwdNew) {
      if (req.body.repeatpwd && req.body.repeatpwd !== req.body.pwdNew) {
        return res.status(400).send({
          status: "Error",
          message: "Las contraseñas deben coincidir.",
        });
      }
      if (!req.body.repeatpwd) {
        return res.status(400).send({
          status: "Error",
          message: "Debes repetir la contraseña.",
        });
      }
    }

    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\sÇçñÑ]+$/.test(req.body.name)) {
      return res.status(400).send({
        status: "Error",
        message: "Campo nombre no permite números ni caracteres especiales.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validatorInfoUser;
