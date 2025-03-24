import supabase from "../config/db-connect";

export const storeRefreshToken = async (userId: number, refreshToken: string): Promise<void> => {
    try {
        const { error } = await supabase
            .from("users")
            .update({ refresh_token: refreshToken })
            .eq("id", userId);

        if (error) {
            console.error("Error storing refresh token:", error.message);
            throw error;
        }
    } catch (error) {
        console.error("Unexpected error in storeRefreshToken:", error);
        throw error;
    }
};

export const getUserByRefreshToken = async (refreshToken: string): Promise<any | null> => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("refresh_token", refreshToken)
            .single();

        if (error) {
            console.error("Error fetching user by refresh token:", error.message);
            return null;
        }

        return data;
    } catch (error) {
        console.error("Unexpected error in getUserByRefreshToken:", error);
        return null;
    }
};