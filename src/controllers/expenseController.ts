import { Response, NextFunction } from "express";
import Expense from "../models/expensesModel";
import User from "../models/userModel";
import { eResultCodes } from "../enums/commonEnums";
import { customRequest } from "../middlewares/customRequest";

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


export { addExpense, getExpense };