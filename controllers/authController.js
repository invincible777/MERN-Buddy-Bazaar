import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

// Registration Controller
export const registerController = async (req, res) => {
  try {
    const { name, email, password, cpassword, phone, address } = req.body;
    // Validation
    if (!name) {
      return res.send({ message: "Name is required!" });
    }
    if (!email) {
      return res.send({ message: "E-mail is required!" });
    }
    if (!password) {
      return res.send({ message: "Password is required!" });
    }
    if (!cpassword) {
      return res.send({ message: "Confirm password is required!" });
    }
    if (password != cpassword) {
      return res.send({ message: "Passwords don't match!" });
    }
    if (!phone) {
      return res.send({ message: "Phone Number is required!" });
    }
    if (!address) {
      return res.send({ message: "Address is required!" });
    }

    // Check existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Email already registered, please login",
      });
    }

    // Register new user
    const hashedPassword = await hashPassword(password);

    // Save new user
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    }).save();

    res.status(201).send({
      success: true,
      message: "User registration successful",
      user,
    });
  } catch (error) {
    console.log(`Error : ${error}`.bgRed.white);
    res.status(500).send({
      sucess: false,
      message: "Could not register",
      error,
    });
  }
};

// Login Controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid credentials",
      });
    }
    // Check existence of user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Email not registered",
      });
    }

    // Password check
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }

    // JWT Token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(`Error : ${error}`.bgRed.white);
    res.status(500).send({
      sucess: false,
      message: "Could not login",
      error,
    });
  }
};
