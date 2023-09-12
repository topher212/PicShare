const getDB = require('../../database/db');

const likeEntry = async (req, res, next) => {
    try {
        const connect = await getDB();

        const { idEntry } = req.params;
        const idUser = req.userInfo.id;

        // Comprobar si la solicitud es para obtener los "likes" de un usuario en su perfil
        if (req.path.startsWith("/users")) {
            // Obtener los "likes" de un usuario específico
            const [userLikes] = await connect.query(
                `SELECT entry_id
                 FROM likes
                 WHERE user_id = ?`, [idUser]
            );

            // Obtener las fotos del usuario
            const [userPhotos] = await connect.query(
                `SELECT idEntry, photo
                 FROM photos
                 WHERE idUser = ?`, [idUser]
            );

            connect.release();

            // Mapear los "likes" de usuario en un objeto para un acceso más fácil
            const userLikesMap = userLikes.reduce((map, like) => {
                map[like.entry_id] = true;
                return map;
            }, {});

            // Agregar el número de "likes" a cada foto del usuario
            const photosWithLikes = userPhotos.map((photo) => ({
                idEntry: photo.idEntry,
                photo: photo.photo,
                likesCount: userLikesMap[photo.idEntry] ? 1 : 0,
            }));

            return res.status(200).send({
                status: 'OK',
                message: 'Likes del usuario obtenidos correctamente',
                data: {
                    userLikes: userLikes.map((like) => like.entry_id),
                }
            });
        }        

        // Comprobar si el usuario ya ha votado la publicación
        const [existingVote] = await connect.query(
            `SELECT id
             FROM likes
             WHERE entry_id = ?`, [idEntry]
        );

        let totalVotes;
        if (existingVote.length > 0) {
            // El usuario ya ha votado, eliminar el voto
            await connect.query(
                `DELETE FROM likes 
                 WHERE user_id = ? AND entry_id = ?`, [idUser, idEntry]
            );

            // Recalcular el número total de votos
            const [total] = await connect.query(
                `SELECT COUNT(*) as totalVotos
                 FROM likes
                 WHERE entry_id = ?`, [idEntry]
            );
            totalVotes = total[0].totalVotos;
        } else {
            // El usuario no ha votado, añadir el voto
            await connect.query(
                `INSERT INTO likes (user_id, entry_id)
                 VALUES (?, ?)`, [idUser, idEntry]
            );

            // Recalcular el número total de votos
            const [total] = await connect.query(
                `SELECT COUNT(*) as totalVotos
                 FROM likes
                 WHERE entry_id = ?`, [idEntry]
            );
            totalVotes = total[0].totalVotos;
        }

        connect.release();

        res.status(200).send({
            status: 'OK',
            message: 'Publicación votada correctamente',
            data: {
                totalVotos: totalVotes
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = likeEntry;