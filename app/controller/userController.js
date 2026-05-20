const UserModel = require("../model/userModel");
const { cloudinary } = require("../config/cloudinaryConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateToken = require("../helper/generateTokens");

class UserController {
  //signup
  async signup(req, res) {
    const { fullname, email, password } = req.body;
    const file = req?.file;
    if (!file) {
      return res.status(400).json({
        status: false,
        message: "Error! Image file is required !!",
      });
    }
    if (!fullname || !email || !password) {
      if (file) {
        cloudinary.uploader
          .destroy(file.filename)
          .catch((err) => console.error("Cloudinary image delete fails", err));
      }
      return res.status(400).json({
        message: "all fields are required !!",
      });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      if (file) {
        cloudinary.uploader
          .destroy(file.filename)
          .catch((err) => console.error("Cloudinary image delete fails", err));
      }
      return res.status(409).json({
        message: "Email is already exists !!",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      fullname,
      email,
      password: hashedPassword,
    });

    newUser.image = {
      url: file.path,
      imageId: file.filename,
    };

    await newUser.save();

    return res.status(201).json({
      status: true,
      message: "User signup successfully",
      data: {
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        image: newUser.image,
      },
    });
  }

  //login
  async login(req, res) {
    const { email, password, rememberMe } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required !!",
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        message: "User does not exists !!",
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect password !!",
      });
    }

    const { accessToken } = generateToken(rememberMe, existingUser);

    return res.status(200).json({
      status: true,
      message: "User login successfully",
      token: accessToken,
      data: {
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
      },
    });
  }

  //change Profile pic
  async updateProfilePic(req, res) {
    const existingUser = await UserModel.findOne({ email: req.user.email });
    const file = req?.file;

    if (!existingUser) {
      return res.status(404).json({
        status: false,
        message: "No user found",
      });
    }
    if (file) {
      if (existingUser?.image.imageId) {
        await cloudinary.uploader.destroy(existingUser.image.imageId);
      }
    }
    existingUser.image = {
      url: file.path,
      imageId: file.filename,
    };
    await existingUser.save();
    return res.status(200).json({
      status: true,
      message: "Profile pic updated successfully",
    });
  }

  async dashboard(req, res) {
    const existingUser = await UserModel.findOne({ email: req?.user?.email });
    if (!existingUser) {
      return res.status(404).json({
        status: false,
        message: "No user found !!",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Data fetch successfully",
      data: {
        fullname: existingUser.fullname,
        email: existingUser.email,
        image: existingUser.image,
      },
    });
  }
}

module.exports = new UserController();
