const getDB = require("../../database/db");

const seeUserProfile = async (req, res, next) => {
  try {
    const { idUser } = req.params;
    const connect = await getDB();

    const [user] = await connect.query(
      `SELECT id as idUser, date, username, name, avatar ,deleted FROM users WHERE id=?`,
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
      `SELECT p.date, p.photo, p.entry_id as idEntry, e.user_id as idUser,
       e.description as description
        FROM photos p
        INNER JOIN entries e ON p.entry_id = e.id
        WHERE e.user_id = ? 
        Order by p.date DESC`,

      [idUser]
    );
    connect.release();

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

      connect.release();

      const [comments] = await connect.query(
        `SELECT c.comment, c.id as idComment, c.user_id as idUser, c.date, c.edit_date, u.username as username, u.avatar as avatar
        FROM comments c 
        JOIN users u ON c.user_id = u.id 
        WHERE entry_id= ? 
       ORDER BY c.date DESC , c.edit_date DESC
        `,
        [photo.idEntry]
      );
      photo["comments"] = comments;

      connect.release();

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
