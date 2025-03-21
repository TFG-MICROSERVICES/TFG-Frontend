import Joi from 'joi';

export const schemaEmail = Joi.object({
    email: Joi.string().required().email({ tlds: false }).max(255).messages({
        'string.empty': 'El correo electrónico es obligatorio',
        'string.email': 'El correo electrónico debe ser un email válido',
    }),
    password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*._]).+$')).required().messages({
        'string.empty': 'La contraseña es obligatoria',
        'string.base': 'La contraseña debe ser un texto',
        'string.min': 'La contraseña debe tener al menos 8 caracteres',
        'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial',
    }),
    password_confirm: Joi.string().valid(Joi.ref('password')).required().messages({
        'string.empty': 'La confirmación de contraseña es obligatoria',
        'string.base': 'La contraseña debe ser un texto',
        'any.only': 'Las contraseñas no coinciden',
    }),
});
