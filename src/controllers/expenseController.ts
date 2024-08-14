import { Response, NextFunction } from "express";
import Expense from "../models/expensesModel";
import User from "../models/userModel";
import { eResultCodes } from "../enums/commonEnums";
import { customRequest } from "../middlewares/customRequest";
import { Op } from "sequelize";
import { read } from "fs";

const addExpense = async (req: customRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req.currentUser as User; // Cast currentUser to the User model type

        if (!user || !user.id) {
            res.status(401).send({ code: eResultCodes.R_UNAUTHORIZED, message: "Unauthorized" });
            return;
        }

        const { expenseName, expenseDescription, expenseAmount } = req.body;

        const expense = await Expense.create({ expenseName, expenseDescription, expenseAmount, UserId: user.id });

        res.status(200).send({ code: eResultCodes.R_SUCCESS, message: "Added Expense", expense })

    } catch (error) {
        console.error(error);
        res.status(500).send({ code: eResultCodes.R_INTERNAL_SERVER_ERROR, Message: "Internal server error" })
    }
}

const getExpense = async (req: customRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req.currentUser as User; // Cast currentUser to the User model type

        const expense = await Expense.findAll({ where: { UserId: user.id } });

        res.status(200).send({ code: eResultCodes.R_SUCCESS, message: "Fecthed Successfully", expense })
    } catch (error) {
        console.error(error);
        res.status(500).send({ code: eResultCodes.R_INTERNAL_SERVER_ERROR, Message: "Internal server error" })
    }
}

const updateExpense = async (req: customRequest, res: Response, next: NextFunction): Promise<void> => {
    try {

        const id = req.params.id;
        const { expenseName, expenseDescription, expenseAmount } = req.body;

        const expense = await Expense.findOne({ where: { id: id } });

        if (!expense) {
            res.status(404).send({ code: eResultCodes.R_NOT_FOUND, message: "Expense Not Found" })
            return;
        }

        expense.expenseName = expenseName;
        expense.expenseDescription = expenseDescription;
        expense.expenseAmount = expenseAmount;

        await expense.save();

        res.status(200).send({ code: eResultCodes.R_SUCCESS, message: "Expense Is Updated", expense })

    } catch (error) {
        console.error(error);
        res.status(500).send({ code: eResultCodes.R_INTERNAL_SERVER_ERROR, message: "Internal server error" })
    }
}

const deleteExpense = async (req: customRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = req.params.id;

        const expense = await Expense.findOne({ where: { id: id } });

        if (!expense) {
            res.status(404).send({ code: eResultCodes.R_NOT_FOUND, message: "Expense Not Found" })
            return;
        }

        await expense.destroy();

        res.status(200).send({ code: eResultCodes.R_SUCCESS, message: "Expense Is Deleted", expense })

    } catch (error) {
        console.error(error);
        res.status(500).send({ code: eResultCodes.R_INTERNAL_SERVER_ERROR, Message: "Internal server error" })
    }
}

const getTodayExpense = async (req: customRequest, res: Response, next: NextFunction): Promise<void> => {
    try {

        const today = new Date().setHours(0, 0, 0, 0);

        const user = req.currentUser as User;

        const todayExpense = await Expense.findAll({
            where: {
                createdAt: {
                    [Op.gte]: today
                },
                UserId: user.id
            }
        })

        if (todayExpense.length === 0) {
            res.status(404).send({ code: eResultCodes.R_NOT_FOUND, message: "No Expense added today" })
            return;
        }

        res.status(200).send({ code: eResultCodes.R_SUCCESS, todayExpense: todayExpense })
    } catch (error) {
        console.error(error);
        res.status(500).send({ code: eResultCodes.R_INTERNAL_SERVER_ERROR, Message: "Internal server error" })
    }
}

const getLastweekExpense = async (req: customRequest, res: Response, next: NextFunction): Promise<void> => {
    try {

        const user = req.currentUser as User;
        const today = new Date();

        const lastMonday = new Date(today);
        console.log(lastMonday);


        lastMonday.setDate(today.getDate() - today.getDay() + 1);
        console.log("after sub", lastMonday);

        lastMonday.setHours(0, 0, 0, 0);

        const lastWeekExpense = await Expense.findAll({
            where: {
                createdAt: {
                    [Op.gte]: lastMonday
                },
                UserId: user.id
            }
        })

        if (lastWeekExpense.length === 0) {
            res.status(404).send({ code: eResultCodes.R_NOT_FOUND, message: "No Expense Added this week" })
            return;
        }

        res.status(200).send({ code: eResultCodes.R_SUCCESS, lastWeekExpense: lastWeekExpense })
    } catch (error) {
        console.error(error);
        res.status(500).send({ code: eResultCodes.R_INTERNAL_SERVER_ERROR, Message: "Internal server error" })
    }
}

const getThisMonthExpense = async (req: customRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req.currentUser as User;
        
        // Get the current date
        const today = new Date();
        
        // Calculate the first day of the current month
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        firstDayOfMonth.setHours(0, 0, 0, 0); // Set time to the start of the day
        
        // Find all expenses created from the first day of the current month to now
        const thisMonthExpenses = await Expense.findAll({
            where: {
                createdAt: {
                    [Op.gte]: firstDayOfMonth
                },
                UserId: user.id
            }
        });

        if (thisMonthExpenses.length === 0) {
            res.status(404).send({ code: eResultCodes.R_NOT_FOUND, message: "No expenses found for this month" });
            return;
        }

        res.status(200).send({ code: eResultCodes.R_SUCCESS, thisMonthExpenses });
    } catch (error) {
        console.error(error);
        res.status(500).send({ code: eResultCodes.R_INTERNAL_SERVER_ERROR, message: "Internal server error" });
    }
};

const getThisYearExpense = async (req: customRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req.currentUser as User;
        const today = new Date();

        const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        firstDayOfYear.setHours(0, 0, 0, 0); 
        
        const thisYearExpenses = await Expense.findAll({
            where: {
                createdAt: {
                    [Op.gte]: firstDayOfYear
                },
                UserId: user.id
            }
        });

        if (thisYearExpenses.length === 0) {
            res.status(404).send({ code: eResultCodes.R_NOT_FOUND, message: "No expenses found for this year" });
            return;
        }

        res.status(200).send({ code: eResultCodes.R_SUCCESS, thisYearExpenses });
    } catch (error) {
        console.error(error);
        res.status(500).send({ code: eResultCodes.R_INTERNAL_SERVER_ERROR, message: "Internal server error" });
    }
};

export { addExpense, getExpense, updateExpense, deleteExpense, getTodayExpense,getLastweekExpense,getThisMonthExpense ,getThisYearExpense};