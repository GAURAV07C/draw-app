import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prismaClient } from "@repo/db/client";
import { JWT_SECRET } from "@repo/backend-common/config";

// Extend the Request interface to include the 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
    }
  }
}

// export const authMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.headers["authorization"];
//   if (!authHeader) {
//     return res.status(401).json({ error: "Authorization token is missing" });
//   }

//   // Extract token from "Bearer <token>" format
//   const token = authHeader.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ error: "Invalid authorization format" });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as {
//       id: string;
//       email: string;
//     };

//     if (!decoded?.id) {
//       return res.status(401).json({ error: "Invalid token payload" });
//     }

//     const user = await prismaClient.user.findUnique({
//       where: { id: decoded.id },
//     });

//     if (!user) {
//       return res.status(401).json({ error: "User not found" });
//     }

//     req.user = { id: user.id, email: user.email }; // Attach user to request
//     next(); // Proceed to next middleware/route
//   } catch (err) {
//     return res.status(401).json({ error: "Invalid or expired token" });
//   }
// };


export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      res.status(401).json({ error: "Authorization token is missing" });
      return;
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader;

    if (!token) {
      res.status(401).json({ error: "Invalid authorization format" });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
    };

    if (!decoded?.id) {
      res.status(401).json({ error: "Invalid token payload" });
      return;
    }

    const user = await prismaClient.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    req.user = { id: user.id, email: user.email }; // Attach user to request
    next(); // ✅ Important: Calls next() to continue request processing
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
};
