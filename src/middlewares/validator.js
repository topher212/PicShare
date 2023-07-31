const { body } = require('express-validator');

const validator = () => {
    return [
        body('mail').trim().notEmpty().withMessage('El mail es requerido')
            .isEmail().withMessage('Debe poner un mail vaido'),

        body('pwd').trim().notEmpty().withMessage('Password es requerida')
            .isLength({ min: 6 }).withMessage('Password invalida')
    ];
};

module.exports = validator;