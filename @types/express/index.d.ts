import { Session, User } from "@prisma/client";

export {};
// const session = PrismaClient;
declare global {
  namespace Express {
    interface Request {
      user_id: number;
      current_session: Session;
      current_user: User;
    }
  }
}
