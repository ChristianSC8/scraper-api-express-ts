// External dependencies
import { Request, Response } from 'express';
import { PoolClient } from 'pg';

// Configurations
import { pool } from '../../config/db-connect';

// Services
import { getUserByRefreshToken } from '../../services/auth-service';
import { updateUser } from '../../services/user-service';


export const handleLogout = async (req: Request, res: Response): Promise<Response> => {
    const client: PoolClient = await pool.connect();
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(204);
    }

    const refreshToken = cookies.jwt;
    const foundUser = await getUserByRefreshToken(refreshToken, client);

    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
        return res.sendStatus(204);
    }

    const userToUpdate = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        password: foundUser.password,
        refresh_token: ""
    };

    await updateUser(userToUpdate, client);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
    return res.status(200).json({ message: "Successfully logged out" });
};
