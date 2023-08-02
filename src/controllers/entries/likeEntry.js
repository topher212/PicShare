const getDB = require('../../database/db');

const likeEntry = async (req, res) => {
    try {
        const connect = await getDB();

        const { idEntry } = req.params;
        const idUser = req.userInfo.id;

        //Comprobar si el user ha votado la publicación
        const [existingVote] = await connect.query(
            `SELECT id
             FROM likes
             WHERE user_id = ? AND entry_id = ?`, [idUser, idEntry]
        );

        let totalVotes;
        if (existingVote.length > 0) {
            //Eliminar voto
            await connect.query(
                `DELETE FROM likes 
                 WHERE user_id = ? AND entry_id = ?`, [idUser, idEntry]
            );

            //Contar votos
            const [total] = await connect.query(
                `SELECT COUNT(*) as totalVotos
                 FROM entries e
                 INNER JOIN likes l ON (l.entry_id = e.id)
                 WHERE e.id = ?`, [idEntry]
            );
            totalVotes = total[0].totalVotos
        } else {
            //Añadir voto
            await connect.query(
                `INSERT INTO likes (user_id, entry_id)
                 values (?, ?)`, [idUser, idEntry]
            );

            //Contar votos
            const [total] = await connect.query(
                `SELECT COUNT(*) as totalVotos
                 FROM entries e
                 INNER JOIN likes l ON (l.entry_id = e.id)
                 WHERE e.id = ?`, [idEntry]
            );
            totalVotes = total[0].totalVotos
        };

        connect.release();

        res.status(200).send({
            status: 'OK',
            message: 'Publicación votada correctamente',
            data: {
                totalVotos: totalVotes
            }
        });

    } catch (error) {
        console.log(error);
    };
};

module.exports = likeEntry;