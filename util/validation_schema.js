const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

// Email validation schema
const emailSchema = Joi.string().email().required();

// Password validation schema
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

// const express = require('express');
// const app = express();

// Example route for user registration
// app.post('/register', (req, res) => {
//   const schema = Joi.object({
//     username: Joi.string().alphanum().min(3).max(30).required(),
//     email: emailSchema,
//     password: passwordSchema,
//     confirmPassword: Joi.ref('password')
//   });

//   const { error, value } = schema.validate(req.body);

//   if (error) {
//     return res.status(400).json({ error: error.details[0].message });
//   }

//   // Process the validated data
//   // ...

//   res.json({ message: 'Registration successful' });
// });

// // Start the server
// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });
