const hapiJoi = require('@hapi/joi')


const validator = (req, res, next) => {
    try {

        if (req.files) {
            if (req.files.avatar) {
                if (req.files.avatar.mimetype !== 'image/jpeg' && req.files.avatar.mimetype !== 'image/jpg' && req.files.avatar.mimetype !== 'image/png') {
                    return res.status(403).send('Formato de imagen no soportado. Introduce una imagen JPG, JPEG o PNG.');
                };

                const name = req.files.avatar.name;

                const schema = hapiJoi.string().max(30).required();
                const validation = schema.validate(name);

                if (validation.error) {
                    return res.status(403).send(validation.error.message);
                };
            };

            if (req.files.photo) {
                if (req.files.photo.mimetype !== 'image/jpeg' && req.files.photo.mimetype !== 'image/jpg' && req.files.photo.mimetype !== 'image/png') {
                    return res.status(403).send('Formato de imagen no soportado. Introduce una imagen JPG, JPEG o PNG.');
                };

                const name = req.files.photo.name;

                const schema = hapiJoi.string().max(30).required();
                const validation = schema.validate(name);

                if (validation.error) {
                    return res.status(403).send(validation.error.message);
                };
            };
        };

        if (req.body.email && req.body.pwd && req.body.name) {
            const userData = req.body;

            const schema = hapiJoi.object().keys({
                email: hapiJoi.string().email().required(),
                pwd: hapiJoi.string().min(6).max(20).alphanum().required(),
                name: hapiJoi.string().min(5).max(15).required()
            });

            const validation = schema.validate(userData);

            if (validation.error) {
                return res.status(403).send(validation.error.message);
            };
        };

        next();

    } catch (error) {
        console.log(error);
    };
};

module.exports = validator;