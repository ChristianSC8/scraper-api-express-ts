"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRoles = void 0;
const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRoles = req.roles;
        if (!userRoles) {
            res.sendStatus(401);
            return;
        }
        const rolesArray = [...allowedRoles];
        const result = userRoles.some((role) => rolesArray.includes(role));
        if (!result) {
            res.sendStatus(401);
            return;
        }
        next();
    };
};
exports.verifyRoles = verifyRoles;
