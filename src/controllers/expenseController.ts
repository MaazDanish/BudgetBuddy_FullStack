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
            res.status(404).send({ code: eResultCodes.R_NOT_FOUND, message:"No Expense added today"})
            return;
        }

        res.status(200).send({ code: eResultCodes.R_SUCCESS, todayExpense: todayExpense })
    } catch (error) {
        console.error(error);
        res.status(500).send({ code: eResultCodes.R_INTERNAL_SERVER_ERROR, Message: "Internal server error" })
    }
}

export { addExpense, getExpense, updateExpense, deleteExpense, getTodayExpense };