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
exports.handleRefreshToken = void 0;
// External dependencies
const jwt = require('jsonwebtoken');
// Configurations
const db_connect_1 = require("../../config/db-connect");
// Services
const auth_service_1 = require("../../services/auth-service");
const roles_service_1 = require("../../services/roles-service");
const handleRefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt)) {
        res.sendStatus(401);
        return;
    }
    const refreshToken = cookies.jwt;
    const client = yield db_connect_1.pool.connect();
    const foundUser = yield (0, auth_service_1.getUserByRefreshToken)(refreshToken, client);
    if (!foundUser) {
        res.sendStatus(403);
        return;
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err || !decoded || foundUser.username !== decoded.username) {
            return res.sendStatus(403);
        }
        const userId = foundUser.id;
        const roles = yield (0, roles_service_1.getUserRoles)(userId, client);
        const accessToken = jwt.sign({
            "UserInfo": {
                "username": decoded.username,
                "roles": roles
            }
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
        return res.json({ roles, accessToken });
    }));
});
exports.handleRefreshToken = handleRefreshToken;
