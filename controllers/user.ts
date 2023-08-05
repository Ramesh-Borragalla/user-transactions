import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { UserType } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const prisma = new PrismaClient();

const creatSession = (
  user_id: number,
  user_type: UserType,
  expires_at: Date
) => {
  return prisma.session.create({
    data: {
      expires_at,
      user_type,
      user_id,
    },
  });
};

const login = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    let { email, password } = request.body;
    // check db
    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error("user with Given Email Doesn't exists");
    }

    const encrypted_password: any = user.password;
    const password_match = await bcrypt.compare(password, encrypted_password);
    if (!password_match) {
      throw new Error("Incorrect Password");
    }
    // create session
    let expire_time = parseInt(process.env.SESSION_EXPIRE_TIME || "1");
    const expiry = new Date(Date.now() + 24 * expire_time * 60 * 60 * 1000);
    const session = await creatSession(user.id, "USER", expiry);

    const token_secret = process.env.SECRET || "secret";
    const token = jwt.sign({ session_id: session.id }, token_secret, {
      expiresIn: `${process.env.SESSION_EXPIRE_TIME}h`,
    });
    response.setHeader("access-token", token);
    response.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        "access-token": token,
      },
    });
  } catch (error: any) {
    console.log(error.type);
    return response.status(400).json({
      errors: [{ type: error.type, message: error.message, error: error }],
    });
  }
};

const register = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  let { name, phone, email, password } = request.body;
  if (!password)
    return response.status(400).json({
      errors: [
        {
          type: "Missing Credentials",
          message: "Password Missing",
          error: {},
        },
      ],
    });
  const salt = await bcrypt.genSalt(10);
  const encrypted_password = await bcrypt.hash(password, salt);
  prisma.user
    .findUnique({
      where: {
        email,
      },
    })
    .then(async (user) => {
      if (user) {
        throw new Error("Email already exists.");
      }
      return prisma.user.create({
        data: {
          name,
          phone,
          email,
          password: encrypted_password,
        },
      });
    })
    .then((result) => {
      response.status(200).json({
        message: "User Registered Successfully.",
      });
    })
    .catch((error) => {
      return response.status(400).json({
        errors: [{ type: error.type, message: error.message, error: error }],
      });
    });
};

const logout = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    prisma.session
      .delete({
        where: {
          id: request.current_session.id,
        },
      })
      .then(() =>
        response.status(200).json({ message: "User LogOut Succesfull" })
      );
  } catch (error: any) {
    return response.status(400).json({
      errors: [{ type: error.type, message: error.message, error: error }],
    });
  }
};

export default { register, login, logout };
