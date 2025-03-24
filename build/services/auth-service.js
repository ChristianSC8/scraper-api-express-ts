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
exports.getUserByRefreshToken = exports.storeRefreshToken = void 0;
const db_connect_1 = __importDefault(require("../config/db-connect"));
const storeRefreshToken = (userId, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = yield db_connect_1.default
            .from("users")
            .update({ refresh_token: refreshToken })
            .eq("id", userId);
        if (error) {
            console.error("Error storing refresh token:", error.message);
            throw error;
        }
    }
    catch (error) {
        console.error("Unexpected error in storeRefreshToken:", error);
        throw error;
    }
});
exports.storeRefreshToken = storeRefreshToken;
const getUserByRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = yield db_connect_1.default
            .from("users")
            .select("*")
            .eq("refresh_token", refreshToken)
            .single();
        if (error) {
            console.error("Error fetching user by refresh token:", error.message);
            return null;
        }
        return data;
    }
    catch (error) {
        console.error("Unexpected error in getUserByRefreshToken:", error);
        return null;
    }
});
exports.getUserByRefreshToken = getUserByRefreshToken;
