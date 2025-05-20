import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

// Middleware to check if the user is an admin
// This middleware checks if the user has the role of 'admin'
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
        const token = req.header('x-auth-token');
        if (!token) {
            res.status(401).json({ message: "No token, authorization denied" });
        }
        try {
            // decode the token
            const secret = process.env.JWT_SECRET;
            const decoded = jwt.verify(token!, secret!) as jwt.JwtPayload;
            // check if the role is admin
            if (decoded.role === 'admin') {
                next();
            }
            
        } catch (error) {
            res.status(500).json({ error, message: "Server Error" });
        }
    };


// Middleware to verify JWT token
// This middleware checks if the token is present in the request header and verifies it
// If the token is valid, it adds the decoded user information to the request object
// If the token is not valid, it sends a 401 Unauthorized response
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("x-auth-token");

  if (!token) {
    res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token!, secret) as jwt.JwtPayload;

    (req as any).user = decoded;

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};