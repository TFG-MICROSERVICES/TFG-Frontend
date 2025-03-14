import Joi from 'joi';

export const schemaLogin = Joi.object({
    email: Joi.string().required().messages({
        'string.empty': 'El correo electrónico es obligatorio',
        'string.email': 'Formato de email inválido',
    }),
    password: Joi.string().required().min(8).messages({
        'string.empty': 'La contraseña es obligatorio',
        'string.min': 'La contraseña debe tener al menos 6 caracteres',
    }),
});
