"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const refresh_token_1 = require("../controllers/auth/refresh-token");
const exception_wrapper_1 = require("../helpers/exception_wrapper");
const logout_1 = require("../controllers/auth/logout");
const sign_up_1 = require("../controllers/auth/sign-up");
const sign_in_1 = require("../controllers/auth/sign-in");
const router = (0, express_1.Router)();
router.post("/register", (0, exception_wrapper_1.wrapper)(sign_up_1.HandleSignUp));
router.post("/login", (0, exception_wrapper_1.wrapper)(sign_in_1.handleSignIn));
router.post("/logout", (0, exception_wrapper_1.wrapper)(logout_1.handleLogout));
router.get("/refresh-token", (0, exception_wrapper_1.wrapper)(refresh_token_1.handleRefreshToken));
exports.default = router;
