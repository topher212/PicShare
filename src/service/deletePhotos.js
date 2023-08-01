const fs = require('fs/promises');
const path = require('path');

const deletePhotos = async (photo, directory) => {
    const dir = process.env.UPLOADS_DIRECTORY;

    const photoPath = path.join(__dirname, dir + directory, photo);
};

module.exports = deletePhotos;