const Joi = require("joi");
const passwordValidation = Joi.string()
  .pattern(
    new RegExp(
      '^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}":;<>,.?~\\-]).{8,}$'
    )
  )
  .required()
  .messages({
    "string.pattern.base":
      "Password must contain at least 1 upper case, 1 number, 1 special character, and atmost 8 characters long.",
  });
  const validatePasswords = Joi.object({
    password: passwordValidation,
    repeat_password: Joi.string()
      .valid(Joi.ref("password")) 
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain at least 1 upper case, 1 number, 1 special character, and at most 8 characters long.",
        "any.only": "Password and repeat_password do not match.", 
      })
  });

// Define the schema for updating a user
const updateUserSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  password: passwordValidation, // password validation
  phone: Joi.string(),
});
const validatePhone = Joi.object({
  phone: Joi.string().required(),
});
const validateOtp = Joi.object({
  phone: Joi.string().required(),
  otp: Joi.string().required().length(4),
  oldHash: Joi.string().required(),
});

// Define the schema for user signup
const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: passwordValidation, // password validation
});

// Define the schema for user login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports= {
    loginSchema,
    signupSchema,
    passwordValidation,
    updateUserSchema,
    validatePhone,
    validateOtp,
    validatePasswords

}