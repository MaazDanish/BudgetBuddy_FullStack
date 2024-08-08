import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import { eResultCodes } from '../enums/commonEnums';
import { customRequest } from './customRequest';

const secretKey: string = process.env.SECRET_KEY as string ?? ''
// interface customRequest extends Request {
//     currentUser: object
// }
const authorizationMiddlware = async (req: customRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token: string | undefined = req.headers.authorization;
 
        if (!token) {
            res.status(401).send({ code: eResultCodes.R_UNAUTHORIZED, message: "Unauthorized! sign in first" })
            return;
        }

        const decode: any = jwt.verify(token, secretKey);

        if (!decode || !decode.userId) {
            res.status(401).send({ code: eResultCodes.R_UNAUTHORIZED, message: "Unauthorized! Invalid Token" })
            return;
        }

        const user = await User.findByPk(decode.userId,{
            attributes:{exclude:['password','createdAt','updatedAt']}
        });

        if (!user) {
            res.status(401).send({ code: eResultCodes.R_USER_NOT_FOUND, message: "User Not Found" })
            return;
        }

        req.currentUser = user;
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(401).json({ code: eResultCodes.R_UNAUTHORIZED, message: 'Time out, please sign in' });
        } else {
            console.error(err);
            res.status(500).send({ code: eResultCodes.R_INTERNAL_SERVER_ERROR, message: "Internal Server Error" })
        }
    }
}

export default authorizationMiddlware;

