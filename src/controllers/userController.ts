import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import bcrypt from 'bcryptjs';
import User from "../models/userModel";
import jwt from 'jsonwebtoken';

const secretKey: string = process.env.SECRET_KEY as string ?? ''

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
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({ name, email, password: hashedPassword, phoneNumber, gender })

        res.status(200).send({ message: "Sign up is successfull.Please Sign in", Success: true })

    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal server error", success: false })
    }
}

export const signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        res.status(400).send({ error: error.array() });
        return;
    }
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            res.status(404).send({ message: "User does not exist,Please sign up first" })
            return;
        }

        const isPassword = await bcrypt.compare(password, user.password);

        if (isPassword) {
            const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
            res.status(200).send({ message: 'Sign in is success', token: token })
        }else{
            res.status(401).send({message:"Authentication Failed",error:"one or more field is incorrect"})
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error", success: false })
    }
}