import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface DecodedToken {
    UserInfo: {
        username: string;
        roles: string[];
    };
}

export const verifyJWT = (req: Request, res: Response, next: NextFunction): void => {

    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        res.sendStatus(401);
        return
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
        (err, decoded) => {

            if (err) {
                return res.sendStatus(403);
            }

            const decodedToken = decoded as JwtPayload & DecodedToken;

            req.user = decodedToken.UserInfo.username;
            req.roles = decodedToken.UserInfo.roles;

            return next();
        }
    );
};

