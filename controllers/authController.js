const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = {
    username: "",
    email: "",
    password: "",
  };

  if (err.message === "Email not registered !!") {
    errors.email = "Email not registered !!";
  }

  if (err.message === "Incorrect Password !!") {
    errors.password = "Incorrect Password !!";
  }

  if (err.code === 11000) {
    errors.email = "Email already registered !!";
    errors.username = "Username already taken :(";
    return errors;
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const maxAge = 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "learning management system project", {
    expiresIn: maxAge,
  });
};

const conn = mongoose.connection;
let gfs;
conn.once("open", () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

const signup_get = (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render("signup", {
        stylesheet: "/signup.css",
        title: ": Sign Up",
        header: "92px",
        files: false,
      });
    } else {
      files.map((file) => {
        if (file.contentType.split("/")[0] === "image") {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      User.find().then((users) => {
        if (
          JSON.stringify(users[users.length - 1].imageId) ===
          JSON.stringify(files[files.length - 1]._id)
        ) {
          res.render("signup", {
            stylesheet: "/signup.css",
            title: ": Sign Up",
            header: "92px",
            files: false,
          });
        } else {
          res.render("signup", {
            stylesheet: "/signup.css",
            title: ": Sign Up",
            header: "92px",
            files: files[files.length - 1],
          });
        }
      });
    }
  });
};

const signup_post = async (req, res) => {
  req.body.gender = "Gender";
  req.body.role = "Role";
  const {
    imageId,
    username,
    firstName,
    lastName,
    gender,
    email,
    password,
    role,
  } = req.body;

  try {
    const user = await User.create({
      imageId,
      username,
      firstName,
      lastName,
      gender,
      email,
      password,
      role,
      course: {
        fbf: false,
        front: false,
        back: false,
      },
    });

    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const login_get = (req, res) => {
  res.render("login", {
    stylesheet: "/login.css",
    title: ": Log In",
    header: "92px",
  });
};

const login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

const profile_update = (req, res) => {
  const id = req.params.id;
  const {
    imageId,
    username,
    firstName,
    lastName,
    gender,
    email,
    password,
    role,
  } = req.body;
  User.findByIdAndUpdate(id, {
    imageId: `${imageId}`,
    username: `${username}`,
    firstName: `${firstName}`,
    lastName: `${lastName}`,
    gender: `${gender}`,
    email: `${email}`,
    password: `${password}`,
    role: `${role}`,
  })
    .then((result) => {
      res.json({ redirect: "/profile" });
    })
    .catch((err) => {
      console.log(err);
    });
};

const fbf_update = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then((result) => {
      result.course.fbf = true;
      result.save().then(() => {
        res.json({ redirect: "/course/fbf" });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const front_update = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then((result) => {
      result.course.front = true;
      result.save().then(() => {
        res.json({ redirect: "/course/front" });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const back_update = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then((result) => {
      result.course.back = true;
      result.save().then(() => {
        res.json({ redirect: "/course/back" });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  signup_get,
  signup_post,
  login_get,
  login_post,
  logout_get,
  profile_update,
  fbf_update,
  front_update,
  back_update,
};
