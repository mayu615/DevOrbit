import jwt from "jsonwebtoken";
import User from "../users/user.model.js";

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already registered");

  const newUser = await User.create({ name, email, password });
  return {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    token: generateToken(newUser._id), // return token here
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid email or password");

  return {
    token: generateToken(user._id),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

export default { registerUser, loginUser };
