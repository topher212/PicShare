const getDB = require("../../database/db");
const fs = require("fs/promises");
const path = require("path");

const searchPhotoDescr = async (req, res) => {
    const { description } = req.query;
  
    if (!description) {
      return res.status(400).send({ error: 'Falta el parámetro "description".' });
    }
  
    const searchQuery = `%${description}%`;
  
    try {
      const connect = await getDB();
      const query = `
        SELECT photos.photo, entries.description
        FROM photos
        JOIN entries ON photos.entry_id = entries.id
        WHERE entries.description LIKE ?;
      `;
      
      const [rows] = await connect.query(query, [searchQuery]);
      connect.release();

      if (rows.length === 0) {
        return res.status(404).send({ message: "No se encontraron fotos." });
      }

      const imagePaths = rows.map((row) => 
      path.join(__dirname, "../../uploads/photos", row.photo)
      );

      return res.status(200).send({ message: "Fotos encontradas con éxito.", photos: rows, imagePaths });

    } catch (error) {
      console.error("Error al buscar las fotos:", error);
      return res.status(500).send({ error: "Error al buscar las fotos." });
    }
  };

module.exports = searchPhotoDescr;