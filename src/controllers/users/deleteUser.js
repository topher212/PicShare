const getDB = require("../../database/db");

const deleteUser = async (req, res, next) => {
  try {
    const connect = await getDB();
    const { idUser } = req.params;

    await connect.query(
      `UPDATE users
             SET password ="[borrado]", name= "[borrado]", active = 0, deleted = 1, lastAuthUpdate = ?
             WHERE id = ?`,
      [new Date(), idUser]
    );

    connect.release();

    res.status(200).send({
      status: "OK",
      message: `El usuario con id: ${idUser} ha sido eliminado`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteUser;
