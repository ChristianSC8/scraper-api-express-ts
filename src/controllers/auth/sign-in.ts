// Configurations
import dotenv from "dotenv";
dotenv.config();

// External dependencies
import { Request, Response } from "express";
import { PoolClient } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Configurations
import { pool } from "../../config/db-connect";

// Services
import { getUserByEmail } from "../../services/user-service";
import { getUserRoles } from "../../services/roles-service";
import { storeRefreshToken } from "../../services/auth-service";


export const handleSignIn = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Missing required fields: email and password" });
    }

    const client: PoolClient = await pool.connect();

    try {
        const findEmail = await getUserByEmail(email, client);

        if (!findEmail) {
            return res.sendStatus(404);
        }

        const match = await bcrypt.compare(password, findEmail.password);

        if (match) {
            const roles = await getUserRoles(findEmail.id, client);

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": findEmail.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: '10s' }
            );

            const refreshToken = jwt.sign(
                { "username": findEmail.username },
                process.env.REFRESH_TOKEN_SECRET!,
                { expiresIn: '1d' }
            );

            await storeRefreshToken(findEmail.id, refreshToken, client);

            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 24 * 60 * 60 * 1000
            });

            return res.json({ roles, accessToken });
        } else {
            return res.sendStatus(401);
        }
    } catch (error) {
        console.error("Error signing in:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    } finally {
        client.release();
    }
};
