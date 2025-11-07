import jwt from "jsonwebtoken";
import { ApiError } from "../libs/apierror.js";
import { db } from "../libs/db.js";

const 
authmiddlware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      throw new ApiError(404, "no token found Unautherized user");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      throw new ApiError(401, "Unauthereised :- token is invalid ");
    }
    const user = await db.user.findUnique({
      where: {
        id: decodedToken.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });
    if (!user) {
      throw new ApiError(404, "user not found ");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(400, "middlware failed");
  }
};
export {authmiddlware};