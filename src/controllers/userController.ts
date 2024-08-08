import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import bcrypt from 'bcryptjs';
import User from "../models/userModel";

export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        res.status(400).send({ error: error.array() });
        return;
    }

    try {
        const { name, email, password, phoneNumber, gender } = req.body;

        const user = await User.findOne({ where: { email: email } });
        if (user) {
            res.status(401).send({ message: "User already exist,Sign in now" });
            return;
        }
        const hashedPassword =await bcrypt.hash(password, 10);

        await User.create({ name, email, password: hashedPassword, phoneNumber, gender })

        res.status(200).send({ message: "Sign up is successfull.Please Sign in", Success: true })

    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal server error", success: false })
    }
}