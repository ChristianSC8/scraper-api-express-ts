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
exports.getUserRoles = exports.assignUserRole = void 0;
const assignUserRole = (userId, roleName, client) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.query(`INSERT INTO user_roles (user_id, role_id)
             VALUES ($1, (SELECT id FROM roles WHERE name = $2))
             ON CONFLICT DO NOTHING`, [userId, roleName]);
    }
    catch (error) {
        console.error("Error assigning role:", error);
        throw error;
    }
});
exports.assignUserRole = assignUserRole;
const getUserRoles = (userId, client) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield client.query("SELECT roles.name FROM user_roles ur JOIN roles ON ur.role_id = roles.id WHERE ur.user_id = $1", [userId]);
        return result.rows.map(row => row.name);
    }
    catch (error) {
        console.error("Error fetching user roles:", error);
        throw error;
    }
});
exports.getUserRoles = getUserRoles;
