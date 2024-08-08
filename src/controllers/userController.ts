import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { eResultCodes } from "../enums/commonEnums";
import bcrypt from 'bcryptjs';
import User from "../models/userModel";
import jwt from 'jsonwebtoken';
import { customRequest } from "../middlewares/customRequest";

const secretKey: string = process.env.SECRET_KEY as string ?? ''



export const signUp = async (req: customRequest, res: Response, next: NextFunction): Promise<void> => {

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
        res.status(200).send({ code: eResultCodes.R_SUCCESS, message: "Sign up is successfull.Please Sign in", Success: true })

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
            res.status(404).send({ code: eResultCodes.R_USER_NOT_FOUND, message: "User not found,Please sign up first" })
            return;
        }

        const isPassword = await bcrypt.compare(password, user.password);

        if (isPassword) {
            const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
            res.status(200).send({ code: eResultCodes.R_SUCCESS, message: 'Sign in is success', token: token })
        } else {
            res.status(401).send({ code: eResultCodes.R_AUTHENTICATION_FAILED, message: "Authentication Failed", error: "one or more field is incorrect" })
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error", success: false })
    }
}

export const getUserInformation = async (req: customRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userInfo = req.currentUser as object;
        res.status(200).send({ code: eResultCodes.R_SUCCESS, user: userInfo })
    } catch (err) {
        console.error(err);
        res.status(500).send({ code: eResultCodes.R_INTERNAL_SERVER_ERROR, message: "Internal Server Error" })
    }
}

export const updateUserInformation = async (req: customRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req.currentUser as any;

        const { name, phoneNumber, gender } = req.body;
        if (name) {
            user.name = name;
        }
        if (phoneNumber) {
            user.phoneNumber = phoneNumber;
        }
        if (gender) {
            user.gender = gender;
        }

        await user.save();

        res.status(200).send({ code: eResultCodes.R_SUCCESS })
    } catch (err) {
        console.error(err);
        res.status(500).send({ code: eResultCodes.R_INTERNAL_SERVER_ERROR, message: "Internal Server Error" })
    }
}

export const deleteUserAccount = async (req: customRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { password } = req.body;
        const user = req.currentUser as any;

        const isUser: any = await User.findByPk(user.id);

        const isPassword = await bcrypt.compare(password, isUser.password);

        if(isPassword){
            await isUser.destroy();
            res.status(200).send({message:"User deleted successfully"});
            return;
        }else{
            res.status(401).send({code:eResultCodes.R_UNAUTHORIZED,msg:"You can't perform this action"})
        }

    } catch (err) {
        console.error(err);
        res.status(500).send({ code: eResultCodes.R_INTERNAL_SERVER_ERROR, message: "Internal Server Error" })
    }
}