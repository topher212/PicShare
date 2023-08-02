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
              status: 'Not Found',
              message: 'User not found',
            });
          }

          const [photos] = await connect.query(
            `SELECT date, photo FROM photos WHERE entry_id IN (SELECT id FROM entries WHERE user_id=?)`,
            [idUser]
          );
      
          connect.release();

          res.status(200).send({
            status: 'OK',
            data: {
                user: user[0],
                photos,
             }
          });
      
    } catch (error) {
        console.log(error);
        res.status(500).send({
           status: 'Error',
           message: 'Internal Server Error',
    });

    }
};

module.exports = seeUserProfile;
