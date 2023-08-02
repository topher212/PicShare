const getDB = require('../database/db');

const canEditComment = async (req, res, next) => {
    try {
        const connect = await getDB();
        const { idComment, idEntry } = req.params;

        const [comment] = await connect.query(
            `SELECT id, user_id
             FROM comments
             WHERE id = ? AND entry_id = ?`, [idComment, idEntry]
        );

        connect.release();

        if (req.userInfo.id !== comment[0].user_id && req.userInfo.role !== 'admin') {
            return res.status(401).send('No tienes permisos para modificar este comentario');
        };

        next();

    } catch (error) {
        console.log(error)
    }
};

module.exports = canEditComment;