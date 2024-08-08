import { Request } from "express";

export interface customRequest extends Request {
    currentUser?: object; // Use the specific type if known
}
