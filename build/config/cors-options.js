"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allowed_origins_1 = require("./allowed-origins");
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowed_origins_1.allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200
};
exports.default = corsOptions;
