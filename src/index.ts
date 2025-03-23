import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
// Configurations
import corsOptions from "./config/cors-options";
import { ROLES } from "./config/roles";
// Middleware
import credentials from "./middleware/credentials";
import { verifyJWT } from "./middleware/verify-jwt";
import { verifyRoles } from "./middleware/verify-roles";
// Routes
import authRoutes from "./routes/auth-route";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(credentials);
app.use(morgan("combined"));

// Public routes
app.use("/api/v1", authRoutes);

// Protected routes
app.use(verifyJWT);
app.get("/api/v1/users", verifyRoles(ROLES.ADMIN), (_req, res) => {
    res.send("¡Hola Mundo!");
});

app.get("/api/v1/tasks", verifyRoles(ROLES.VIEWER), (_req, res) => {
    res.send("¡Hola Mundo Tasks!");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
