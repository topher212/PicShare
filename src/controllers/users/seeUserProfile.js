const getDB = require("../../database/db");

const seeUserProfile = async (req, res, next) => {
  try {
    const { idUser } = req.params;
    const connect = await getDB();

    const [user] = await connect.query(
      `SELECT date, username, name, avatar ,deleted FROM users WHERE id=?`,
      [idUser]
    );

    if (!user.length) {
      return res.status(404).send({
        status: "Error",
        message: "Usuario no encontrado",
      });
    }
    if (user[0].deleted === 1) {
      return res.status(404).send({
        status: "Error",
        message: "Este usuario ha sido borrado",
      });
    }

    const [photos] = await connect.query(
      `SELECT date, photo, entry_id as idEntry 
      FROM photos 
      WHERE entry_id IN (SELECT id FROM entries WHERE user_id=?)`,
      [idUser]
    );

    const photosWithLikesAndComments = photos.map(async (photo) => {
      const [totalLikes] = await connect.query(
        `
        SELECT COUNT(*) as likes, e.id as idEntry
        FROM entries e
        JOIN likes l ON l.entry_id = e.id
        WHERE entry_id=?
        `,
        [photo.idEntry]
      );

      photo["likes"] = totalLikes[0].likes;

      const [comments] = await connect.query(
        `
        SELECT comment, user_id, date, edit_date
        FROM comments
        WHERE entry_id=?
        `,
        [photo.idEntry]
      );
      photo["comments"] = comments;

      if (!photo["comments"].length) {
        photo["comments"] = "No hay comentarios en esta publicación";
      }
    });

    await Promise.all(photosWithLikesAndComments);

    await res.status(200).send({
      status: "OK",
      data: {
        user: user[0],
        photos: photos,
      },
    });

    connect.release();
  } catch (error) {
    next(error);
  }
};

module.exports = seeUserProfile;
