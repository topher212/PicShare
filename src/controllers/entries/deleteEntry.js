const getDB = require('../../database/db');
const deletePhotoDir = require('../../service/deletePhotos');

const deleteEntry = async (req, res) => {
    try {
        const connect = await getDB();
        const { idEntry } = req.params;
        const idUser = req.userInfo.id;

        // Seleccionar las fotos asociadas a la publicación
        const [photos] = await connect.query(
            `SELECT photo
             FROM photos
             WHERE entry_id = ?`, [idEntry]
        );

        // borrar las fotos de la publicación en la tabla photos
        await connect.query(
            `DELETE FROM photos
             WHERE entry_id = ?`, [idEntry]
        );

        // eliminar las fotos de la carpeta del usuario
        for (let photo of photos) {
            await fs.unlink(`${__dirname}../../uploads/photos/${idUser}/${photo}`);
        };

        // borrar posibles votos que tenga la publicación
        await connect.query(
            `DELETE FROM likes 
             WHERE entry_id = ?`, [idEntry]
        );

        // eliminar la entrada de la db
        await connect.query(
            `DELETE FROM entries
             WHERE id = ?`, [idEntry]
        );

        connect.release();

        res.status(200).send([{
            status: 'OK',
            message: `La publicación con id ${idEntry} y sus elementos fueron eliminados.`
        }]);


    } catch (error) {
        console.log(error);
    };
};

module.exports = deleteEntry;