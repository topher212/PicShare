const getDB = require('../../database/db');

const deleteComment = async (req, res, next) => {
    try {
        const connect = await getDB();

        const { idComment } = req.params;

        await connect.query(
            `DELETE FROM comments
             WHERE id = ?`, [idComment]
        );

        connect.release();

        res.status(200).send({
            status: 'OK',
            message: `El comentario ha sido borrado correctamente.`
        });

    } catch (error) {
        next(error);
    }
};

module.exports = deleteComment;