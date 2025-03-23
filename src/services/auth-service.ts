import { PoolClient } from "pg";

export const storeRefreshToken = async (
    userId: number,
    refreshToken: string,
    client: PoolClient
): Promise<void> => {
    try {
        await client.query(
            "UPDATE users SET refresh_token = $1 WHERE id = $2",
            [refreshToken, userId]
        );
    } catch (error) {
        console.error("Error storing refresh token:", error);
        throw error;
    }
};

export const getUserByRefreshToken = async (refreshToken: string, client: PoolClient): Promise<any> => {
    try {
        const result = await client.query(
            'SELECT * FROM users WHERE refresh_token = $1',
            [refreshToken]
        );
        return result.rows[0]; 
    } catch (error) {
        console.error('Error fetching user by refreshToken:', error);
        throw error;
    }
};