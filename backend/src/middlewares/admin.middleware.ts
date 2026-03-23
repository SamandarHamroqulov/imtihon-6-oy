import { NextFunction, Request, Response } from "express";

export const adminMiddleware = async (req: Request, res:Response, next: NextFunction) => {
try {
    let user = (req as any).user;
    if(user.role !== "admin") {
        return res.status(403).json({message: "Forbbidden request: only for admin"})
    }
    next()
    
} catch (err: any) {
    return res.status(500).json({message: "Forbbidden request: only for admin"})
    
}
}