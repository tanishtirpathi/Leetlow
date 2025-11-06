import brcypt from "bcryptjs";
import {ApiError} from "../libs/apierror.js";
import {db} from "../libs/db.js";
const regester = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      throw new DApiError(401, "user already exist ");
    }
  } catch (error) {}
};
const login = async (req, res) => {};
const logout = async (req, res) => {};
const checkUser = async (req, res) => {};
export { regester, login, logout, checkUser };
