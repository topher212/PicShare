const getDB = require("../database/db");
const path = require("path");
const fs = require("fs/promises");

const deleteOldAvatar = async (req, res, next) => {
  try {
    const connect = await getDB();
    const idUser = req.userInfo.id;

    const [user] = await connect.query(
      `SELECT avatar FROM users WHERE id = ?`,
      [idUser]
    );

    if (user[0].avatar) {
      await connect.query(
        `UPDATE users 
         SET avatar = ? 
         WHERE id = ?`,
        ['', idUser]
      );

      const avatarPath = path.join(`${__dirname}../../uploads/avatarUser/${idUser}/${user[0].avatar}`);
      await fs.unlink(avatarPath);
    };

    next();

  } catch (error) {
    next();
  }
};

module.exports = deleteOldAvatar;
