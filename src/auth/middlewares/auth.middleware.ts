import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../helpers/jwt";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;
    // if (!token) {
    //     return res.status(401).json({ error: "Unauthorized" });
    // }

    // const { payload, newToken } = verifyToken(token);
    // if (!payload) {
    //     return res.status(401).json({ error: "Invalid token" });
    // }
    // req.body.user = payload
    // const headers = new Headers({ token: newToken })
    // res.setHeaders(headers)
    next();
};
