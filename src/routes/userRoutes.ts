import { Router } from "express";
import { signUp, signIn, getUserInformation, updateUserInformation } from "../controllers/userController";
import { userValidationRules, signInValidationRules } from "../validators/userValidation";
import authorizationMiddlware from '../middlewares/auth-middleware'

const router = Router();

router.post('/sign-up', userValidationRules, signUp);
router.post('/sign-in', signInValidationRules, signIn);
router.get('/getuserinfo', authorizationMiddlware, getUserInformation);
router.patch('/edituserinfo', authorizationMiddlware, updateUserInformation);

export default router;