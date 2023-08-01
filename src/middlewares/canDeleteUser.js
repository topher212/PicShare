const getDB = require('../database/db');

const canDeleteUser = async (req, res, next) => {
    try {
        const connect = await getDB();
        const { idUser } = req.params;

        const [user] = await connect.query(
            `SELECT id
             FROM users
             WHERE id = ?`, [idUser]
        );

        connect.release();

        if (req.userInfo.id !== user[0].id && req.userInfo.role !== 'admin') {
            return res.status(401).send('No tiene permisos para eliminar este usuario');
        };

        next();

    } catch (error) {
        console.log(error);
    };
};

module.exports = canDeleteUser;