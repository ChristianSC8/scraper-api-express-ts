"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// Configurations
const cors_options_1 = __importDefault(require("./config/cors-options"));
const roles_1 = require("./config/roles");
// Middleware
const credentials_1 = __importDefault(require("./middleware/credentials"));
const verify_jwt_1 = require("./middleware/verify-jwt");
const verify_roles_1 = require("./middleware/verify-roles");
// Routes
const auth_route_1 = __importDefault(require("./routes/auth-route"));
// Load environment variables
dotenv_1.default.config();
// Initialize Express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Middleware setup
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(cors_options_1.default));
app.use(credentials_1.default);
app.use((0, morgan_1.default)("combined"));
// Public routes
app.use("/api/v1", auth_route_1.default);
// Protected routes
app.use(verify_jwt_1.verifyJWT);
app.get("/api/v1/users", (0, verify_roles_1.verifyRoles)(roles_1.ROLES.ADMIN), (_req, res) => {
    res.send("¡Hola Mundo!");
});
app.get("/api/v1/tasks", (0, verify_roles_1.verifyRoles)(roles_1.ROLES.VIEWER), (_req, res) => {
    res.send("¡Hola Mundo Tasks!");
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
