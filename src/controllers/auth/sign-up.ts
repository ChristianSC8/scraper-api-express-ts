import { Request, Response } from "express";
import bcrypt from "bcryptjs";
// Configurations
import { ROLES } from "../../config/roles";
// Services
import { deleteUserById, getEmail, newUserId } from "../../services/user-service";
import { assignUserRole } from "../../services/roles-service";


export const HandleSignUp = async (req: Request, res: Response): Promise<Response> => {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            data: { message: "Missing required fields: username, email, or password" }
        });
    }

    try {
        const emailExists = await getEmail(email);

        if (emailExists) {
            return res.status(409).json({
                success: false,
                data: { message: "Email already exists" }
            });
        }
 
        const hashedPassword = await bcrypt.hash(password, 10);
        const responseUserId = await newUserId(username, email, hashedPassword);
        
        try {
            await assignUserRole(responseUserId, ROLES.VIEWER);
        } catch (error) {
            await deleteUserById(responseUserId);
            return res.status(500).json({
                success: false,
                data: { message: "Role assignment failed, user registration rolled back" }
            });
        }

        return res.status(201).json({
            success: true,
            data: { userId: responseUserId }
        });

    } catch (err) {
        console.error("Error in registerUser:", err);
        return res.sendStatus(500);
    } 
};
