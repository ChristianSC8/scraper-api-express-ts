
import supabase from "../config/db-connect";

export const assignUserRole = async (userId: number, roleName: string) => {
    try {

        const { data: role, error: roleError } = await supabase
            .from("roles")
            .select("id")
            .eq("name", roleName)
            .single();

        if (roleError || !role) {
            throw new Error(`Role '${roleName}' not found`);
        }

        const { error } = await supabase
            .from("user_roles")
            .insert([{ user_id: userId, role_id: role.id }]);

        if (error) throw error;

    } catch (error) {
        console.error("Error assigning role:", error);
        throw error;
    }
};


export const getUserRoles = async (userId: number): Promise<string[]> => {
    try {
        const { data, error } = await supabase
            .from("user_roles")
            .select("roles(name)") 
            .eq("user_id", userId);

        if (error) throw error;

        return data.map((row: any) => row.roles.name);
    } catch (error) {
        console.error("Error fetching user roles:", error);
        throw error;
    }
};