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
exports.handleSignIn = void 0;
// Configurations
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Configurations
const db_connect_1 = require("../../config/db-connect");
// Services
const user_service_1 = require("../../services/user-service");
const roles_service_1 = require("../../services/roles-service");
const auth_service_1 = require("../../services/auth-service");
const handleSignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Missing required fields: email and password" });
    }
    const client = yield db_connect_1.pool.connect();
    try {
        const findEmail = yield (0, user_service_1.getUserByEmail)(email, client);
        if (!findEmail) {
            return res.sendStatus(404);
        }
        const match = yield bcrypt_1.default.compare(password, findEmail.password);
        if (match) {
            const roles = yield (0, roles_service_1.getUserRoles)(findEmail.id, client);
            const accessToken = jsonwebtoken_1.default.sign({
                "UserInfo": {
                    "username": findEmail.username,
                    "roles": roles
                }
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
            const refreshToken = jsonwebtoken_1.default.sign({ "username": findEmail.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
            yield (0, auth_service_1.storeRefreshToken)(findEmail.id, refreshToken, client);
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 24 * 60 * 60 * 1000
            });
            return res.json({ roles, accessToken });
        }
        else {
            return res.sendStatus(401);
        }
    }
    catch (error) {
        console.error("Error signing in:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
    finally {
        client.release();
    }
});
exports.handleSignIn = handleSignIn;
