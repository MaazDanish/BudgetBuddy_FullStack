import { Router } from "express";
import { addExpense, deleteExpense, getExpense, updateExpense,getTodayExpense, getLastweekExpense, getThisMonthExpense, getThisYearExpense } from "../controllers/expenseController";
import authorizationMiddlware from "../middlewares/auth-middleware";


const router = Router();

router.post('/add-expense', authorizationMiddlware, addExpense);
router.get('/get-expense', authorizationMiddlware, getExpense);
router.put('/edit-expense/:id', updateExpense);
router.delete('/delete-expense/:id', deleteExpense);
router.get('/get-today-expense',authorizationMiddlware, getTodayExpense);
router.get('/get-last-week-expense',authorizationMiddlware, getLastweekExpense);
router.get('/get-this-month-expense',authorizationMiddlware, getThisMonthExpense);
router.get('/get-this-year-expense',authorizationMiddlware, getThisYearExpense);


export default router;