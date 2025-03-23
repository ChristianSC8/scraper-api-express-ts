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
exports.updateUser = exports.getUserByEmail = exports.newUserId = exports.getEmail = void 0;
const getEmail = (email, client) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield client.query("SELECT 1 FROM users WHERE email = $1 LIMIT 1", [email]);
    }
    catch (error) {
        console.error("Error checking email:", error);
        throw error;
    }
});
exports.getEmail = getEmail;
const newUserId = (username, email, hashedPassword, client) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield client.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id", [username, email, hashedPassword]);
        return result.rows[0].id;
    }
    catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
});
exports.newUserId = newUserId;
const getUserByEmail = (email, client) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield client.query("SELECT * FROM users WHERE email = $1 LIMIT 1", [email]);
        if (result.rowCount === null || result.rowCount === 0) {
            return null;
        }
        return result.rows[0];
    }
    catch (error) {
        console.error("Error fetching user by email:", error);
        throw error;
    }
});
exports.getUserByEmail = getUserByEmail;
const updateUser = (user, client) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, username, email, password, refresh_token } = user;
        const fields = { username, email, password, refresh_token };
        const setValues = [];
        const values = [];
        let index = 1;
        for (const [field, value] of Object.entries(fields)) {
            if (value !== undefined) {
                setValues.push(`${field} = $${index}`);
                values.push(value);
                index++;
            }
        }
        if (setValues.length === 0)
            return null;
        const query = `UPDATE users SET ${setValues.join(', ')} WHERE id = $${index} RETURNING *`;
        values.push(id);
        const { rows } = yield client.query(query, values);
        return rows[0];
    }
    catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
});
exports.updateUser = updateUser;
