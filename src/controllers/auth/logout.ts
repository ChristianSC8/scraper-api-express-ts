// External dependencies
import { Request, Response } from 'express';

// Services
import { getUserByRefreshToken } from '../../services/auth-service';
import { updateUser } from '../../services/user-service';


export const handleLogout = async (req: Request, res: Response): Promise<Response> => {

    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(204);
    }

    const refreshToken = cookies.jwt;
    const foundUser = await getUserByRefreshToken(refreshToken);

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

    await updateUser(userToUpdate);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
    return res.status(200).json({ message: "Successfully logged out" });
};
