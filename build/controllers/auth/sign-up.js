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
exports.HandleSignUp = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
// Configurations
const roles_1 = require("../../config/roles");
const db_connect_1 = require("../../config/db-connect");
// Services
const user_service_1 = require("../../services/user-service");
const roles_service_1 = require("../../services/roles-service");
const HandleSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            data: { message: "Missing required fields: username, email, or password" }
        });
    }
    const client = yield db_connect_1.pool.connect();
    try {
        yield client.query("BEGIN");
        const emailExists = yield (0, user_service_1.getEmail)(email, client);
        if (((_a = emailExists === null || emailExists === void 0 ? void 0 : emailExists.rowCount) !== null && _a !== void 0 ? _a : 0) > 0) {
            yield client.query("ROLLBACK");
            return res.status(409).json({
                success: false,
                data: { message: "Email already exists" }
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const responseUserId = yield (0, user_service_1.newUserId)(username, email, hashedPassword, client);
        yield (0, roles_service_1.assignUserRole)(responseUserId, roles_1.ROLES.VIEWER, client);
        yield client.query("COMMIT");
        return res.status(201).json({
            success: true,
            data: { userId: responseUserId }
        });
    }
    catch (err) {
        console.error("Error in registerUser:", err);
        yield client.query("ROLLBACK");
        return res.sendStatus(500);
    }
    finally {
        client.release();
    }
});
exports.HandleSignUp = HandleSignUp;
