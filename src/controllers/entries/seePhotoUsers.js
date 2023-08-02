const getDB = require("../../database/db");

const seePhotoUsers = async (req, res) => {
  try {
    const connect = await getDB();
    const [users] = await connect.query(
      `
                SELECT  u.name, u.email as userName, p.photo, 
                p.date, e.description, e.place, e.id as idEntry
                FROM users u
                 JOIN entries e ON e.user_id=u.id
                 JOIN photos p ON p.entry_id=e.id
                ORDER BY p.date, u.name;
      `
    );

    let userMap = users.map((user) => {
      return [user.userName, user];
    });
    const userMapArr = new Map(userMap);
    let userUnique = [...userMapArr.values()];

    userUnique.sort(function (a, b) {
      return b.date - a.date;
    });

    const PhotosWithLikes = userUnique.map(async (user) => {
      const [total] = await connect.query(
        `
      SELECT  COUNT(*) as likes, e.id as idEntry
      FROM entries e
      JOIN likes l ON l.entry_id = e.id
      WHERE entry_id=?
    `,
        [user.idEntry]
      );
      if (user.idEntry === total[0].idEntry) {
        user["likes"] = total[0].likes;
      } else {
        user["likes"] = 0;
      }
    });

    Promise.all(PhotosWithLikes).then(async () => {
      await res.status(200).send({
        status: "OK",
        data: userUnique,
      });
    });

    connect.release();
  } catch (error) {
    console.log(error);
  }
};

module.exports = seePhotoUsers;
