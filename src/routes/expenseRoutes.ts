import { Router } from "express";
import { addExpense, deleteExpense, getExpense, updateExpense } from "../controllers/expenseController";
import authorizationMiddlware from "../middlewares/auth-middleware";


const router = Router();

router.post('/add-expense', authorizationMiddlware, addExpense);
router.get('/get-expense', authorizationMiddlware, getExpense);
router.put('/edit-expense/:id', updateExpense);
router.delete('/delete-expense/:id', deleteExpense);


export default router;