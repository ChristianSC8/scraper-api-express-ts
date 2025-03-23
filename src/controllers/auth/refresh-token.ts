// External dependencies
const jwt = require('jsonwebtoken');
import { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import { PoolClient } from "pg";

// Configurations
import { pool } from "../../config/db-connect";

// Services
import { getUserByRefreshToken } from "../../services/auth-service";
import { getUserRoles } from "../../services/roles-service";


export const handleRefreshToken = async (req: Request, res: Response): Promise<void> => {

    const cookies = req.cookies;

    if (!cookies?.jwt) {
        res.sendStatus(401);
        return;
    }
    const refreshToken = cookies.jwt;

    const client: PoolClient = await pool.connect();

    const foundUser = await getUserByRefreshToken(refreshToken, client);
    if (!foundUser) {
        res.sendStatus(403);
        return
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
        async (err: Error | null, decoded: JwtPayload | undefined) => {

            if (err || !decoded || foundUser.username !== decoded.username) {
                return res.sendStatus(403);
            }
            const userId = foundUser.id;
            const roles = await getUserRoles(userId, client);

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: '10s' }
            );

            return res.json({ roles, accessToken });
        }
    );
}
