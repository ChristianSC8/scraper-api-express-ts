import { Router } from "express";

import { handleRefreshToken } from "../controllers/auth/refresh-token";
import { wrapper } from "../helpers/exception_wrapper";
import { handleLogout } from "../controllers/auth/logout";
import { HandleSignUp } from "../controllers/auth/sign-up";
import { handleSignIn } from "../controllers/auth/sign-in";

const router = Router();

router.post("/register", wrapper(HandleSignUp));
router.post("/login", wrapper(handleSignIn));
router.post("/logout", wrapper(handleLogout));
router.get("/refresh-token", wrapper(handleRefreshToken));

export default router;
