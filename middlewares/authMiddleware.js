import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Token based protected route

export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(`Error : ${error}`.bgRed.white);
    res.status(401).send({
      success: false,
      message: "Error in token middleware",
      error,
    });
  }
};

// Admin access

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(`Error : ${error}`.bgRed.white);
    res.status(401).send({
      success: false,
      message: "Error in admin middleware",
      error,
    });
  }
};
