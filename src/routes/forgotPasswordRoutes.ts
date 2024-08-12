import { Router } from "express";
import { requestResetPassword, verifyOTP, updatePassword } from "../controllers/forgotPasswordController.ts";


const router = Router();

router.post('/request-reset-password/:email', requestResetPassword);
router.post('/resetPassword-verifyotp/:otp', verifyOTP);
router.post('/update-password', updatePassword);

export default router;