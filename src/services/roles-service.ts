import { PoolClient } from "pg";

export const assignUserRole = async (
    userId: number,
    roleName: string,
    client: PoolClient
): Promise<void> => {
    try {
        await client.query(
            `INSERT INTO user_roles (user_id, role_id)
             VALUES ($1, (SELECT id FROM roles WHERE name = $2))
             ON CONFLICT DO NOTHING`,
            [userId, roleName]
        );
    } catch (error) {
        console.error("Error assigning role:", error);
        throw error;
    }
};

export const getUserRoles = async (userId: number, client: PoolClient): Promise<string[]> => {
    try {
        const result = await client.query(
            "SELECT roles.name FROM user_roles ur JOIN roles ON ur.role_id = roles.id WHERE ur.user_id = $1",
            [userId]
        );
        return result.rows.map(row => row.name); 
    } catch (error) {
        console.error("Error fetching user roles:", error);
        throw error;
    }
};