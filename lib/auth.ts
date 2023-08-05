const jwt = require("jsonwebtoken");
import { NextFunction, Request, Response } from "express";
import { PrismaClient, Prisma, Session } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();
const prisma = new PrismaClient();

const auth = (req: Request) => {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(
        req.headers["access-token"],
        process.env.SECRET,
        (error: any, payload: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(payload && payload.session_id);
          }
        }
      );
    } catch (error) {
      reject(new Error("Invalid Payload"));
    }
  })
    .then((session_id: any) => {
      if (!session_id) {
        throw new Error("Invalid Session");
      }

      return prisma.session.findUnique({
        where: { id: parseInt(session_id) },
      });
    })
    .then((session) => {
      if (!session) {
        throw new Error("Invalid Session");
      } else {
        return session;
      }
    });
};

const user = (req: Request, res: Response, next: NextFunction) => {
  auth(req)
    .then((session) => {
      if (session.user_type !== "USER") {
        throw new Error("Invalid Session");
      }
      req.current_session = session;
      return session.user_id;
    })
    .then((user_id) => {
      return prisma.user.findUnique({
        where: { id: user_id },
      });
    })
    .then((user) => {
      if (!user) {
        throw new Error("Invalid Session");
      }
      req.current_user = user;
      next();
    })
    .catch((error) =>
      res.status(400).json({
        errors: [
          {
            type: error.type,
            message: error.message || "Invalid Session",
            error: error,
          },
        ],
      })
    );
};

export { user };
