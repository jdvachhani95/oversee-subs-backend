import * as Joi from 'joi';

export const UpdateProfileInputValidationSchema = Joi.object({
  first_name: Joi.string()
    .trim()
    .min(1)
    .max(30)
    .pattern(/^[a-zA-z']+([\s][a-zA-Z']+)*$/, 'first name'),
  last_name: Joi.string()
    .trim()
    .min(1)
    .max(30)
    .pattern(/^[a-zA-z']+([\s][a-zA-Z']+)*$/, 'last name'),
  location: Joi.string().trim().min(1).max(50),
  subscriptions: Joi.array().items(
    Joi.object({
      _id: Joi.string().trim().min(1).max(30),
      planId: Joi.string().trim().min(1).max(30).required(),
      service: Joi.string().trim().min(1).max(30).required(),
      name: Joi.string().trim().min(1).max(30).required(),
      type: Joi.string().valid('Bi-weekly', 'Monthly', 'Yearly').required(),
      amount: Joi.number().required(),
    }),
  ),
}).unknown();
