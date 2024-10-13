//json web token
import jwt from 'jsonwebtoken'
import {TOKEN_SECRET} from '../conf'



export function createToken(payload: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        jwt.sign({ id: payload }, TOKEN_SECRET, { expiresIn: "3m" }, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token as string);
            }
        });
    });
}