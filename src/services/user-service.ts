import { User } from "../models/user-model";
import supabase from "../config/db-connect";

export const getEmail = async (email: string): Promise<boolean> => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .single();

        if (error && error.code !== "PGRST116") throw error;
        return !!data;

    } catch (error) {
        console.error("Error checking email:", error);
        throw error;
    }
};

export const newUserId = async (
    username: string,
    email: string,
    hashedPassword: string
): Promise<number> => {
    try {
        const { data, error } = await supabase
            .from("users")
            .insert([{ username, email, password: hashedPassword }])
            .select("id")
            .single();

        if (error || !data) throw error;
        return data.id;

    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const getUserByEmail = async (email: string) => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (error) {
            if (error.code === "PGRST116") return null;
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Error fetching user by email:", error);
        throw error;
    }
};

export const updateUser = async (user: User) => {
    try {
        const { id, ...updatedFields } = user;

        const { data, error } = await supabase
            .from("users")
            .update(updatedFields)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export const deleteUserById = async (userId: number): Promise<string> => {
    const { error } = await supabase.from("users").delete().eq("id", userId);

    if (error) {
        console.error("Error deleting user:", error.message);
        return "Failed to delete user.";
    }

    return "User deleted successfully.";
};