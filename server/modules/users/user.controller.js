import User from "./user.model.js"; // correct path to the User model

export const getAllUsers = async (req, res) => {
  try {
    // exclude logged-in user if needed: { _id: { $ne: req.user._id } }
    const users = await User.find().select("-password"); // exclude passwords
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching users" });
  }
};
