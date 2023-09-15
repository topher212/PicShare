const getDB = require("../../database/db");

const seePhotoUsers = async (req, res, next) => {
  try {
    const connect = await getDB();
    const [users] = await connect.query(
      `SELECT u.name, u.username as username, p.photo, u.avatar as avatar,
      p.date, e.description, e.place, e.id as idEntry, e.user_id as idUser, u.deleted
      FROM users u
       JOIN entries e ON e.user_id=u.id
       JOIN photos p ON p.entry_id=e.id
      WHERE NOT u.deleted
      ORDER BY p.date, u.name`
    );

    let userMap = users.map((user) => {
      return [user.username, user];
    });
    const userMapArr = new Map(userMap);
    let userUnique = [...userMapArr.values()];

    userUnique.sort(function (a, b) {
      return b.date - a.date;
    });

    const photosWithLikesAndComments = userUnique.map(async (user) => {
      const [totalLikes] = await connect.query(
        `SELECT COUNT(*) as likes, e.id as idEntry
        FROM entries e
        JOIN likes l ON l.entry_id = e.id
        WHERE entry_id =?`,
        [user.idEntry]
      );
      user["likes"] = totalLikes[0].likes;
      connect.release();

      const [comments] = await connect.query(
<<<<<<< Updated upstream
        `SELECT c.comment, c.user_id as idUser, c.date, c.edit_date, u.username as username, u.avatar as avatar, u.deleted as 'user deleted'
=======
        `SELECT c.comment, c.id as idComment, c.user_id as idUser, c.date, c.edit_date, u.username as username, u.avatar as avatar
>>>>>>> Stashed changes
        FROM comments c 
        JOIN users u ON c.user_id = u.id 
        WHERE entry_id= ? AND NOT u.deleted
        ORDER BY c.date DESC , c.edit_date DESC
        `,
        [user.idEntry]
      );
      user["comments"] = comments;
      connect.release();

      if (!user["comments"].length) {
        user["comments"] = "No hay comentarios en esta publicación";
      }
    });

    await Promise.all(photosWithLikesAndComments);
    connect.release();

    await res.status(200).send({
      status: "OK",
      data: userUnique,
    });

    connect.release();
  } catch (error) {
    next(error);
  }
};

module.exports = seePhotoUsers;
