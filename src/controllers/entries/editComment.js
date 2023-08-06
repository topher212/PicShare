const getDB = require('../../database/db');

const editComment = async (req, res) => {
    try {
        const connect = await getDB();

        const { idComment } = req.params;
        const { comment } = req.body;

        await connect.query(
            `UPDATE comments
             SET comment = ?, edit_date = ?
             WHERE id = ?`, [comment, new Date(), idComment]
        );

        connect.release();

        res.status(200).send({
            status: 'OK',
            message: `El comentario ha sido modificado correctamente.`
        });

    } catch (error) {
        ext(error);
    }
};

module.exports = editComment;