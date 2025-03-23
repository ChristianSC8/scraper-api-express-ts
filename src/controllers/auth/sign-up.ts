import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PoolClient } from "pg";

// Configurations
import { ROLES } from "../../config/roles";
import { pool } from "../../config/db-connect";

// Services
import { getEmail, newUserId } from "../../services/user-service";
import { assignUserRole } from "../../services/roles-service";


export const HandleSignUp = async (req: Request, res: Response): Promise<Response> => {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            data: { message: "Missing required fields: username, email, or password" }
        });
    }

    const client: PoolClient = await pool.connect();
    try {
        await client.query("BEGIN");

        const emailExists = await getEmail(email, client);
        if ((emailExists?.rowCount ?? 0) > 0) {
            await client.query("ROLLBACK");
            return res.status(409).json({
                success: false,
                data: { message: "Email already exists" }
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const responseUserId = await newUserId(username, email, hashedPassword, client);
        await assignUserRole(responseUserId, ROLES.VIEWER, client);
        await client.query("COMMIT");

        return res.status(201).json({
            success: true,
            data: { userId: responseUserId }
        });


    } catch (err) {
        console.error("Error in registerUser:", err);
        await client.query("ROLLBACK");
        return res.sendStatus(500);
    } finally {
        client.release();
    }
};
