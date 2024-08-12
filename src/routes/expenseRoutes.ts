import { Router } from "express";
import { addExpense, getExpense } from "../controllers/expenseController";
import authorizationMiddlware from "../middlewares/auth-middleware";


const router = Router();

router.post('/add-expense', authorizationMiddlware, addExpense);
router.get('/get-expense', authorizationMiddlware, getExpense);


export default router;