import { PoolClient } from "pg";
import { User } from "../models/user-model";

export const getEmail = async (
    email: string,
    client: PoolClient
) => {
    try {
        return await client.query("SELECT 1 FROM users WHERE email = $1 LIMIT 1", [email]);
    } catch (error) {
        console.error("Error checking email:", error);
        throw error;
    }
};

export const newUserId = async (
    username: string,
    email: string,
    hashedPassword: string,
    client: PoolClient
): Promise<number> => {
    try {
        const result = await client.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id",
            [username, email, hashedPassword]
        );
        return result.rows[0].id;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};


export const getUserByEmail = async (email: string, client: PoolClient) => {
    try {
        const result = await client.query(
            "SELECT * FROM users WHERE email = $1 LIMIT 1",
            [email]
        );

        if (result.rowCount === null || result.rowCount === 0) {
            return null;
        }
        return result.rows[0];
    } catch (error) {
        console.error("Error fetching user by email:", error);
        throw error;
    }
};

export const updateUser = async (user: User, client: PoolClient) => {
    try {
        const { id, username, email, password, refresh_token } = user;
        const fields: { [key: string]: any } = { username, email, password, refresh_token };
        const setValues: string[] = [];
        const values: any[] = [];
        let index = 1;

        for (const [field, value] of Object.entries(fields)) {
            if (value !== undefined) {
                setValues.push(`${field} = $${index}`);
                values.push(value);
                index++;
            }
        }

        if (setValues.length === 0) return null;

        const query = `UPDATE users SET ${setValues.join(', ')} WHERE id = $${index} RETURNING *`;
        values.push(id);

        const { rows } = await client.query(query, values);
        return rows[0];
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};
