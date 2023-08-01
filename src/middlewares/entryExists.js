const getDB = require('../database/db');

const entryExists = async (req, res, next) => {
    try {
        const connect = await getDB();

        const { idEntry } = req.params;

        const [entry] = await connect.query(
            `SELECT id
             FROM entries
             WHERE id = ?`, [idEntry]
        );

        connect.release();

        if (entry.length === 0) {
            return res.status(404).send('No existe la publicación');
        };

        next();

    } catch (error) {
        console.log(error);
    };
};

module.exports = entryExists;