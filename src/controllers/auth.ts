import { RequestHandler } from "express";
import { insertUser } from "../services/auth";
import bcrypt from "bcrypt";

const ROUNDS = 10;

export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    const hashedPass = await bcrypt.hash(password, ROUNDS);

    const result = await insertUser(firstname, lastname, email, hashedPass);
  } catch (error: any) {
    next(error);
  }
};
