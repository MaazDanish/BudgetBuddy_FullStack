const { body } = require('express-validator');

export const userValidationRules = [
    body('name').isString().withMessage('Name must be a string'),
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/\d/).withMessage('Password must contain at least one numeric digit')
        .matches(/[@#$%^&*]/).withMessage('Password must contain at least one special character (@, #, $, %, ^, &, *)'),
    body('phoneNumber').isString().optional().withMessage('Phone number must be a string'),
    body('gender').isIn(['male', 'female']).optional().withMessage('Gender must be one of: male or female')
];

export const signInValidationRules = [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must contain at least 6 characters')
        .isString().withMessage('Password must be string not number')
]
// export default { userValidationRules, signInValidationRules };