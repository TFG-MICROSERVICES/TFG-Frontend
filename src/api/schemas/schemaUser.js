import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  name: Joi.string()
    .max(100)
    .messages({
      'string.max': 'El nombre no puede exceder los 100 caracteres',
    }),
  lastName: Joi.string()
    .max(100)
    .messages({
      'string.max': 'Los apellidos no pueden exceder los 100 caracteres',
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .messages({
      'string.email': 'El correo electrónico debe ser válido',
    }),
  phone_number: Joi.string()
    .pattern(/^[0-9]{9,15}$/)
    .allow('', null)
    .messages({
      'string.pattern.base': 'El teléfono debe tener entre 9 y 15 dígitos',
    }),
  birthdate: Joi.date()
    .less('now')
    .messages({
      'date.base': 'La fecha de nacimiento debe ser válida',
      'date.less': 'La fecha de nacimiento debe ser anterior a hoy',
    }),
  city: Joi.string()
    .max(100)
    .allow('', null)
    .messages({
      'string.max': 'La ciudad no puede exceder los 100 caracteres',
    }),
  autonomous_region: Joi.string()
    .max(100)
    .allow('', null)
    .messages({
      'string.max': 'La comunidad autónoma no puede exceder los 100 caracteres',
    }),
  main_sport_id: Joi.number()
    .integer()
    .allow(null)
    .messages({
      'number.base': 'El deporte principal debe ser un número',
    }),
});

export const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'string.empty': 'La contraseña actual es requerida',
    'any.required': 'La contraseña actual es requerida',
  }),
  newPassword: Joi.string().min(8).required().messages({
    'string.empty': 'La nueva contraseña es requerida',
    'string.min': 'La nueva contraseña debe tener al menos 8 caracteres',
    'any.required': 'La nueva contraseña es requerida',
  }),
  confirmPassword: Joi.any().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Las contraseñas no coinciden',
    'any.required': 'Debes confirmar la nueva contraseña',
  }),
});
