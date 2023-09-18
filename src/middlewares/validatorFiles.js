const hapiJoi = require("@hapi/joi");

const validatorFiles = (req, res, next) => {
  try {
    if (req.files) {
      if (req.files.avatar) {
        if (
          req.files.avatar.mimetype !== "image/jpeg" &&
          req.files.avatar.mimetype !== "image/jpg" &&
          req.files.avatar.mimetype !== "image/png"
        ) {
          return res.status(403).send({
            status: "Error",
            message:
              "Formato de imagen no soportado. Introduce una imagen JPG, JPEG o PNG.",
          });
        }

        const name = req.files.avatar.name;

        const schema = hapiJoi
          .string()
          .max(80)
          .message("El nombre del archivo no puede superar los 80 caracteres")
          .required();
        const validation = schema.validate(name);

        if (validation.error) {
          return res.status(403).send(validation.error.message);
        }
      }

      if (req.files.photo) {
        if (
          req.files.photo.mimetype !== "image/jpeg" &&
          req.files.photo.mimetype !== "image/jpg" &&
          req.files.photo.mimetype !== "image/png"
        ) {
          return res.status(403).send({
            status: "Error",
            message:
              "Formato de imagen no soportado. Introduce una imagen JPG, JPEG o PNG.",
          });
        }

        const name = req.files.photo.name;

        const schema = hapiJoi
          .string()
          .max(80)
          .message("El nombre del archivo no puede superar los 80 caracteres")
          .required();
        const validation = schema.validate(name);

        if (validation.error) {
          return res.status(403).send(validation.error.message);
        }
      }
    }
    if (!req.files) {
      return res
        .status(409)
        .send({ status: 409, message: "Me falta el archivo" });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validatorFiles;
