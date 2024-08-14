
import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import smtpTransport from "nodemailer-smtp-transport";
import sib from 'sib-api-v3-sdk';
import { eResultCodes } from "../enums/commonEnums";
import ForgotPassword from "../models/forgotPasswordModel";



function generateOTP(): string {
    const digits: string = '0123456789';
    let OTP: string = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex: number = Math.floor(Math.random() * digits.length);
        OTP += digits[randomIndex];
    }

    return OTP;
}

const requestResetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const email = req.params.email;

        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            res.status(404).send({ code: eResultCodes.R_USER_NOT_FOUND, message: "User Not Found" })
            return
        }

        const otp = generateOTP();

        const object = {
            UserId: user.id,
            isActive: true,
            otp: otp
        }

        await ForgotPassword.create(object);

        const defaultClient = sib.ApiClient.instance;
        const apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.API_KEY;

        const transporter = nodemailer.createTransport(smtpTransport({
            host: process.env.BREVO_HOST,
            port: process.env.BREVO_PORT as number | undefined,
            auth: {
                user: process.env.BREVO_MAILID,
                pass: process.env.BREVO_PASSWORD
            }

        }))

        const mailOptions = {
            from: process.env.BREVO_MAILID,
            to: req.params.email,
            text: `Dear ${user.name},
                    We noticed that you requested to reset your password for your BudgetBuddy account. Don't worry, we're here to help you regain access to your account securely.
                    BudgetBuddy is your go-to platform for managing and tracking your expenses with ease. Whether you're budgeting for daily needs, planning a big purchase, or simply keeping an eye on your spending, BudgetBuddy provides the tools you need to stay on top of your financial goals.
                    To reset your password, please use the following one-time password (OTP) within the next 10mints:
                    ${otp}
                    Once you've entered the OTP, you'll be prompted to create a new password for your BudgetBuddy account. If you didn't request this password reset, please disregard this email – your account is still secure.
                    If you have any questions or need further assistance, feel free to reach out to our support team at BudgetBuddy@gmail.com.
                    Best regards,
                    The BudgetBuddy Team
            `
        }

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                res.status(500).send({ code: eResultCodes.R_INTERNAL_SERVER_ERROR })
            } else {
                res.status(200).send({ code: eResultCodes.R_SUCCESS })
            }
        })

    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal server error", success: false })
    }
}

const verifyOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const otp = req.params.otp;
        const isOtp = await ForgotPassword.findOne({
            where: {
                otp: otp,
                isActive: true
            },
            order: [['updatedAt', 'DESC']]
        })

        if (!isOtp) {
            res.status(404).send({ code: eResultCodes.R_NOT_FOUND })
            return;
        }
        const otps = isOtp.otp;
        res.status(200).send({ otp: otps, success: true, code: eResultCodes.R_SUCCESS })

    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal server error", success: false })
    }
}

const updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { password, otp } = req.body;

        const fp = await ForgotPassword.findOne({
            where: {
                otp: otp,
                isActive: true,
            },
            order: [['updatedAt', 'DESC']]
        })

        if (!fp) {
            res.status(404).send({ code: eResultCodes.R_NOT_FOUND, message: "OTP is invalid" })
            return;
        }

        const id = fp.UserId;

        const user = await User.findOne({ where: { id: id } })

        if (!user) {
            res.status(404).send({ code: eResultCodes.R_NOT_FOUND, message: "User Not Found" })
            return;
        }

        await fp.update({ isActive: false });

        const hashedPassword = await bcrypt.hash(password, 10);

        await user.update({ password: hashedPassword })

        res.status(200).send({ code: eResultCodes.R_SUCCESS, message: "Your password has been updated successfully" })

    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal server error", success: false })
    }
}
export { requestResetPassword, verifyOTP, updatePassword };