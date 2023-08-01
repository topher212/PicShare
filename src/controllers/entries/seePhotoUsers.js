const getDB = require("../../database/db");
const fs = require("fs/promises");
const path = require("path");

const seePhotoUsers = async (req, res) => {
  try {
    const connect = await getDB();
    const [users] = await connect.query(
      `
                SELECT  u.name, u.email, p.photo, p.date, e.description, e.comment, e.place
                FROM users u
                 JOIN entries e ON e.user_id=u.id
                 JOIN photos p ON p.entry_id=e.id
                ORDER BY p.date, u.name;
      `
    );

    let userMap = users.map((user) => {
      return [user.email, user];
    });
    const userMapArr = new Map(userMap);
    const userUnique = [...userMapArr.values()];

    userUnique.sort(function (a, b) {
      return b.date - a.date;
    });

    res.send(userUnique);
    connect.release();
  } catch (error) {
    console.log(error);
  }
};

module.exports = seePhotoUsers;
