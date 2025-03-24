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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRoles = exports.assignUserRole = void 0;
const db_connect_1 = __importDefault(require("../config/db-connect"));
const assignUserRole = (userId, roleName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data: role, error: roleError } = yield db_connect_1.default
            .from("roles")
            .select("id")
            .eq("name", roleName)
            .single();
        if (roleError || !role) {
            throw new Error(`Role '${roleName}' not found`);
        }
        const { error } = yield db_connect_1.default
            .from("user_roles")
            .insert([{ user_id: userId, role_id: role.id }]);
        if (error)
            throw error;
    }
    catch (error) {
        console.error("Error assigning role:", error);
        throw error;
    }
});
exports.assignUserRole = assignUserRole;
const getUserRoles = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = yield db_connect_1.default
            .from("user_roles")
            .select("roles(name)")
            .eq("user_id", userId);
        if (error)
            throw error;
        return data.map((row) => row.roles.name);
    }
    catch (error) {
        console.error("Error fetching user roles:", error);
        throw error;
    }
});
exports.getUserRoles = getUserRoles;
