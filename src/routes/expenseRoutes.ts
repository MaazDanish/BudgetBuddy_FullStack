import { Router } from "express";
import { addExpense } from "../controllers/expenseController";
import authorizationMiddlware from "../middlewares/auth-middleware";


const router = Router();

router.post('/add-expense', authorizationMiddlware, addExpense);


export default router;