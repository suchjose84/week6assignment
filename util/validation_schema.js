const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const emailSchema = Joi.string().email().required();

const passwordSchema = Joi.string()
  .custom((value, helpers) => {
    const complexityOptions = {
      min: 8,
      max: 26,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 4
    };

    const { error } = passwordComplexity(complexityOptions).validate(value);
    if (error) {
      return helpers.error('any.invalid');
    }

    return value;
  })
  .required()
  .messages({
    'string.empty': 'Password is required',
    'any.invalid': 'Password must meet the complexity requirements'
  });

module.exports = {
  emailSchema,
  passwordSchema
};


