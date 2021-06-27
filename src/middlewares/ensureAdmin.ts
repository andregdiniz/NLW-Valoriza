import { Request, Response, NextFunction } from "express";
import { UserRepositories } from "../repositories/UserRepositories";
import { getCustomRepository } from "typeorm";

export async function ensureAdmin(request: Request, response: Response, next: NextFunction) {

  const { user_id } = request;

  console.log(user_id);

  const userRepositories = getCustomRepository(UserRepositories);

  const { admin } = await userRepositories.findOne(user_id);

  if (admin) {
    return next();
  }

  return response.status(401).json({
    error: "Anauthorized!",
  });
}