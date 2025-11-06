import { userRole } from "../generated/prisma/index.js";
import { ApiError } from "../libs/apierror.js";

import { ApiResponse } from "../libs/apiresponse.js";
import { db } from "../libs/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const regester = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      throw new ApiError(409, "user already exist ");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      throw new ApiError(404, "password not hased ");
    }
    const newUser = await db.user.create({
      data: {
        name,
        password: hashedPassword,
        email,
        role: userRole.USER,
      },
    });
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });
    const user = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      image: newUser.image,
    };
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 2,
    });
    res.status(201).json(new ApiResponse(201, "new user regester ", user));
  } catch (error) {
    console.error(`we got error in regester controller ${error}`);
    throw new ApiError(404, error, "error in regester controller ");
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new ApiError(404, "user not found  ");
    }
    const PasswordCompare = await bcrypt.compare(password, user.password);
    if (!PasswordCompare) {
      throw new ApiError(401, "invalid credentials ");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });
    const LogedInUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      image: user.image,
    };
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 2,
    });
    res
      .status(201)
      .json(new ApiResponse(201, "new user regester ", LogedInUser));
  } catch (error) {
    console.error(`we got error in regester controller ${error}`);
    throw new ApiError(404, error, "error in regester controller ");
  }
};
const logout = async (req, res) => {};
const checkUser = async (req, res) => {};
export { regester, login, logout, checkUser };
