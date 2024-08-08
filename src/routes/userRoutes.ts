import { Router } from "express";
import { signUp } from "../controllers/userController";
import userValidationRules from "../validators/userValidation";

const router = Router();

router.post('/sign-up', userValidationRules, signUp);

export default router;