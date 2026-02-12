const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcryptjs = require('bcryptjs');

async function registeruser(req, res) {
  const {
    email,
    fullName: { firstName, lastName },
    password,
  } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    email,
  });

  if (isUserAlreadyExists) {
    res.status(400).json({
      message: "User already exists",
    });
  }

  const hashpassword = await bcryptjs.hash(password, 10);

  const user = await userModel.create({
    email,
    fullName: {
      firstName,
      lastName,
    },
    password: hashpassword,
  });

  const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
  res.cookie("token", token);
  res.status(201).json({
    message: "User created successfully",
    user: {
        email: user.email,
        _id: user._id,
        fullName: user.fullName
    }
  })
}
async function loginuser(req, res){
  const { email, password} = req.body;
  const user = await userModel.findOne({
    email
  });
  if(!user){
    return res.status(400).json({
      message: "Invalid email or password"
    })
  }
  const isValidPassword = await bcryptjs.compare(password, user.password);
  if(!isValidPassword){
    return res.status(400).json({
      message: "Invalid email or password"
    })
  }
  const token = jwt.sign({
    id: user._id
  }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(201).json({
    message: "Logged in successfully",
    user: {
        email: user.email,
        _id: user._id,
        fullName: user.fullName
    }
  })
}
async function getUser(req, res){
  const user = await userModel.findById(req.user._id);
  res.status(200).json({
    message: "User fetched successfully",
    user
    });
}

async function logout(req, res) {
  // Clear the token cookie
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out' });
}

module.exports = {
    registeruser,
    loginuser,
  getUser,
  logout
}