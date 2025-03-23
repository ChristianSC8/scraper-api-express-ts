import { Request, Response, NextFunction } from "express";

export const verifyRoles = (...allowedRoles: string[]) => {
    
    return (req: Request, res: Response, next: NextFunction): void => {
        
        const userRoles = (req as any).roles; 
        if (!userRoles) {
            res.sendStatus(401);
            return; 
        }

        const rolesArray = [...allowedRoles];
        const result = userRoles.some((role: string) => rolesArray.includes(role));

        if (!result) {
            res.sendStatus(401);
            return;
        }

        next(); 
    };
};
