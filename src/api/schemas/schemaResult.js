import Joi from "joi";

export const updateSchemaResult = Joi.object({
    score_home: Joi.number().integer().min(0).required().messages({
      "number.base": "Debe ser un número",
      "number.min": "No puede ser negativo",
      "any.required": "Obligatorio",
    }),
    score_away: Joi.number().integer().min(0).required().messages({
      "number.base": "Debe ser un número",
      "number.min": "No puede ser negativo",
      "any.required": "Obligatorio",
    }),
    playedAt: Joi.date().required().messages({
        "date.base": "Debe ser una fecha válida",
        "any.required": "La fecha y hora del partido es obligatoria",
    }),
});