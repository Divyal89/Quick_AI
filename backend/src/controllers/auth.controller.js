import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import tokenBlacklistModel from "../models/blacklist.model.js";

// register new user
async function registerUserController(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Please provide the empty details",
    });
  }

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "Account already exist with the email",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  return res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

// Login controller
// async function logininUserController(req, res) {
//   const { email, password } = req.body;

//   const user = await userModel.findOne({ email });

//   if (!user) {
//     return res.status(400).json({
//       message: "Invalid email or password",
//     });
//   }

//   const isPasswordValid = await bcrypt.compare(password, user.password);

//   if (!isPasswordValid) {
//     return res.status(400).json({
//       message: "Invalid email or password",
//     });
//   }

//   const token = jwt.sign(
//     { id: user._id, username: user.username },
//     process.env.JWT_SECRET,
//     { expiresIn: "1d" },
//   );

//   res.cookie("token", token);
//   res.status(200).json({
//     message: "User login Successfully",
//     user: {
//       id: user._id,
//       username: user.username,
//       email: user.email,
//     },
//   });
// }

async function logininUserController(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Our server is currently unavailable. Please try again later.",
    });
  }
}

// logout controller

async function logoutUserController(req, res) {
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
}

async function getMeController(req, res) {
  const user = await userModel.findById(req.user.id);

  res.status(200).json({
    message: "User details fetched successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export default {
  registerUserController,
  logininUserController,
  logoutUserController,
  getMeController,
};
