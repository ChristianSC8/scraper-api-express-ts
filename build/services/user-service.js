"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserById = exports.updateUser = exports.getUserByEmail = exports.newUserId = exports.getEmail = void 0;
const db_connect_1 = __importDefault(require("../config/db-connect"));
const getEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = yield db_connect_1.default
            .from("users")
            .select("id")
            .eq("email", email)
            .single();
        if (error && error.code !== "PGRST116")
            throw error;
        return !!data;
    }
    catch (error) {
        console.error("Error checking email:", error);
        throw error;
    }
});
exports.getEmail = getEmail;
const newUserId = (username, email, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = yield db_connect_1.default
            .from("users")
            .insert([{ username, email, password: hashedPassword }])
            .select("id")
            .single();
        if (error || !data)
            throw error;
        return data.id;
    }
    catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
});
exports.newUserId = newUserId;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = yield db_connect_1.default
            .from("users")
            .select("*")
            .eq("email", email)
            .single();
        if (error) {
            if (error.code === "PGRST116")
                return null;
            throw error;
        }
        return data;
    }
    catch (error) {
        console.error("Error fetching user by email:", error);
        throw error;
    }
});
exports.getUserByEmail = getUserByEmail;
const updateUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = user, updatedFields = __rest(user, ["id"]);
        const { data, error } = yield db_connect_1.default
            .from("users")
            .update(updatedFields)
            .eq("id", id)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
});
exports.updateUser = updateUser;
const deleteUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = yield db_connect_1.default.from("users").delete().eq("id", userId);
    if (error) {
        console.error("Error deleting user:", error.message);
        return "Failed to delete user.";
    }
    return "User deleted successfully.";
});
exports.deleteUserById = deleteUserById;
