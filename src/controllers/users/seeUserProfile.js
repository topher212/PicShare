const getDB = require("../../database/db");

const seeUserProfile = async (req, res) => {
  try {
    const { idUser } = req.params;
    const connect = await getDB();

    const [user] = await connect.query(
      `SELECT date, email, name, avatar FROM users WHERE id=?`,
      [idUser]
    );

    if (!user.length) {
      return res.status(404).send({
        status: "Not Found",
        message: "User not found",
      });
    }

    const [photos] = await connect.query(
      `SELECT date, photo, entry_id as idEntry 
      FROM photos 
      WHERE entry_id IN (SELECT id FROM entries WHERE user_id=?)`,
      [idUser]
    );

    const PhotosWithLikes = photos.map(async (user) => {
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
        data: {
          user: user[0],
          photos: photos,
        },
      });
    });

    connect.release();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Error",
      message: "Internal Server Error",
    });
  }
};

module.exports = seeUserProfile;
