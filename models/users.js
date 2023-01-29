const mongoose = require("mongoose");

const schema = mongoose.Schema({
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: String,
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'users',
  }
}, {
  timestamps: true,
  versionKey: false,
});

const User = mongoose.model("users", schema);

const getUserByEmail = async (email) => {
  try {
    const searchByEmail = await User.findOne({ email });
    return searchByEmail;
  } catch (error) {
    console.error(error);
  }
}

const updateUserSubscription = async (_id, body) => {
  try {
    const contactUpdate = await User.findById({_id});
    return await User.findByIdAndUpdate(contactUpdate, { ...body }, { new: true });
  } catch (error) {
    console.error(error.message)
  }
}

module.exports = {
  User,
  getUserByEmail,
  updateUserSubscription
}