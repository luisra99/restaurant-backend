import jwt from "jsonwebtoken";

const SECRET_KEY = "your_secret_key"; // Cambia esto a algo más seguro

export const generateToken = (payload: object, expiresIn: string = "2h"): string => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

export const verifyToken = (token: string): any => {
    try {
        const payload = jwt.verify(token, SECRET_KEY)
        const newToken = jwt.sign(payload, SECRET_KEY)
        return { payload, newToken }
    } catch (error) {
        console.log(error)
        return { payload: null };
    }
};