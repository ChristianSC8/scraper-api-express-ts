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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByRefreshToken = exports.storeRefreshToken = void 0;
const storeRefreshToken = (userId, refreshToken, client) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [refreshToken, userId]);
    }
    catch (error) {
        console.error("Error storing refresh token:", error);
        throw error;
    }
});
exports.storeRefreshToken = storeRefreshToken;
const getUserByRefreshToken = (refreshToken, client) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield client.query('SELECT * FROM users WHERE refresh_token = $1', [refreshToken]);
        return result.rows[0];
    }
    catch (error) {
        console.error('Error fetching user by refreshToken:', error);
        throw error;
    }
});
exports.getUserByRefreshToken = getUserByRefreshToken;
