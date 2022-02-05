const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  firstName: {
    type: String,
    uppercase: true,
  },
  lastName: {
    type: String,
    uppercase: true,
  },
  gender: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please enter an Email."],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Email Invalid !!"],
  },
  password: {
    type: String,
    required: [true, "Please enter Password."],
    minlength: [6, "Enter minimum 6 characters."],
  },
  role: {
    type: String,
  },
  course: {
    fbf: {
      type: Boolean,
    },
    front: {
      type: Boolean,
    },
    back: {
      type: Boolean,
    },
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  let update = { ...this.getUpdate() };
  if (update.password) {
    const salt = await bcrypt.genSalt();
    update.password = await bcrypt.hash(this.getUpdate().password, salt);
    this.setUpdate(update);
  }
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect Password !!");
  }
  throw Error("Email not registered !!");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
