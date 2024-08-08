import { Router } from "express";
import { signUp ,signIn} from "../controllers/userController";
import { userValidationRules, signInValidationRules } from "../validators/userValidation";

const router = Router();

router.post('/sign-up', userValidationRules, signUp);
router.post('/sign-in', signInValidationRules, signIn);

export default router;