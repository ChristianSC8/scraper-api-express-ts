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
exports.handleLogout = void 0;
// Configurations
const db_connect_1 = require("../../config/db-connect");
// Services
const auth_service_1 = require("../../services/auth-service");
const user_service_1 = require("../../services/user-service");
const handleLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_connect_1.pool.connect();
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt)) {
        return res.sendStatus(204);
    }
    const refreshToken = cookies.jwt;
    const foundUser = yield (0, auth_service_1.getUserByRefreshToken)(refreshToken, client);
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
        return res.sendStatus(204);
    }
    const userToUpdate = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        password: foundUser.password,
        refresh_token: ""
    };
    yield (0, user_service_1.updateUser)(userToUpdate, client);
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
    return res.status(200).json({ message: "Successfully logged out" });
});
exports.handleLogout = handleLogout;
