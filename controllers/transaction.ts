import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

const prisma: PrismaClient = new PrismaClient();

const makeTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { amount, payment_id, status, to_user_id } = req.body;
    const from_user_id = req.current_user.id;
    prisma.transaction
      .create({
        data: {
          amount: amount,
          payment_id: payment_id,
          status: status,
          from_user_id: from_user_id,
          to_user_id: to_user_id,
        },
      })
      .then((result) => {
        if (result) {
          res.status(200).json({
            message: "Transaction Created Successfully",
            data: result,
          });
        } else {
          throw new Error("Something went wrong while creating transaction.");
        }
      });
  } catch (error: any) {
    return res.status(400).json({
      errors: [
        {
          type: error.type,
          message: error.message,
          error: error,
        },
      ],
    });
  }
};

const fetchAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = req.current_user.id;
    prisma.transaction
      .findMany({
        where: {
          OR: [{ from_user_id: user_id }, { to_user_id: user_id }],
        },
        include: {
          from_user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
          to_user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      })
      .then((result) => {
        if (result) {
          return res.status(200).json(result);
        }
      });
  } catch (error: any) {
    return res.status(400).json({
      errors: [
        {
          type: error.type,
          message: error.message,
          error: error,
        },
      ],
    });
  }
};

const fetch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction_id = req.params.id;
    if (!transaction_id) {
      throw new Error("Please provide transaction id to fetch details.");
    }
    prisma.transaction
      .findUnique({
        where: {
          id: parseInt(transaction_id),
        },
        include: {
          from_user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
          to_user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
        },
        // select: {
        //   id: true,
        //   payment_id: true,
        //   amount: true,
        //   status: true,
        //   created_at: true,
        // },
      })
      .then((result) => {
        if (result) {
          return res.status(200).json({
            result,
          });
        } else {
          throw new Error("Error fetching transaction details.");
        }
      })
      .catch((err) => {
        return res.status(400).json({
          errors: [
            {
              type: err.type,
              message: err.message,
              error: err,
            },
          ],
        });
      });
  } catch (error: any) {
    return res.status(400).json({
      errors: [
        {
          type: error.type,
          message: error.message,
          error: error,
        },
      ],
    });
  }
};

const getBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = req.current_user.id;
    prisma.user
      .findUnique({
        where: {
          id: user_id,
        },
      })
      .then((result) => {
        if (result) {
          return res.status(200).json({
            data: {
              balance: result.balance,
            },
          });
        }
      })
      .catch((err) => {
        return res.status(400).json({
          errors: [
            {
              type: err.type,
              message: err.message,
              error: err,
            },
          ],
        });
      });
  } catch (error: any) {
    return res.status(400).json({
      errors: [
        {
          type: error.type,
          message: error.message,
          error: error,
        },
      ],
    });
  }
};

export default { makeTransaction, fetchAll, fetch, getBalance };
