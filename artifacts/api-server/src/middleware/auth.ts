import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/firebase-admin";

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Missing or invalid token" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  if (process.env.NODE_ENV !== "production" && (idToken === "demo" || idToken === "demo-token" || idToken === "dev-token")) {
    req.user = {
      uid: "dev-demo-user-123",
      email: "demo@momentum.ai",
    };
    return next();
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
    next();
  } catch (error) {
    req.log.error({ error }, "Firebase auth error");
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
