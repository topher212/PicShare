const getDB = require('../../database/db');

const commentEntry = async (req, res) => {
    try {
        const connect = await getDB();
        const { idEntry } = req.params;
        const idUser = req.userInfo.id;

        const { comment } = req.body;
        if (!comment) {
            return res.status(400).send('El campo comentario es obligatorio');
        };

        // Comprobar que existe el comentario
        const [existingComment] = await connect.query(
            `SELECT id
             FROM comments
             WHERE user_id = ? AND entry_id = ?`, [idUser, idEntry]
        );

        if (existingComment.length === 0) {
            return res.status(400).send('El comentario no existe o no tienes permiso para modificarlo.');
        };

        await connect.query(
            `INSERT INTO comments (comment, user_id, entry_id)
             VALUES (?, ?, ?)`, [comment, idUser, idEntry]
        );

        connect.release();

        res.status(200).send({
            status: 'OK',
            message: 'Publicación comentada correctamente.',
            data: {
                entry: idEntry,
                comment: comment
            }
        });

    } catch (error) {
        console.log(error);
    };
};

module.exports = commentEntry;