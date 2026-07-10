import jwt from "jsonwebtoken";
import tokenBlacklistModel from "../models/blacklist.model.js";

async function authUser(req, res, next) {
  console.log("Origin:", req.headers.origin);
  console.log("Cookies:", req.cookies);
  console.log("Header Cookie:", req.headers.cookie);

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token not provided",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Token not provided",
    });
  }

  const isTokenBlacklisted = await tokenBlacklistModel.findOne({
    token,
  });

  if (isTokenBlacklisted) {
    return res.status(401).json({
      message: "token is invalid",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token.",
    });
  }
}

export default {
  authUser,
};
