const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

const app = express();
const {
  requireAuth,
  loggedIn,
  checkUser,
} = require("./middleware/authMiddleware");
const { getTasks } = require("./middleware/taskMiddleware");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

app.set("view engine", "ejs");

const dbURI = "mongodb+srv://lms_user:hst_13@cluster0.gmuj3.mongodb.net/lms-db";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(process.env.PORT || 3000))
  .catch((err) => console.log(err));

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.get("*", checkUser);
app.get("*", getTasks);

app.get("/", loggedIn, (req, res) => {
  res.render("index", {
    stylesheet: "/index.css",
    title: "Project",
    header: "92px",
  });
});

app.get("/dashboard", requireAuth, async (req, res) => {
  res.render("dashboard", {
    stylesheet: "/dashboard.css",
    title: ": Dashboard",
    header: "140px",
  });
});

app.get("/profile", requireAuth, (req, res) => {
  res.render("profile", {
    stylesheet: "/profile.css",
    title: ": Profile",
    header: "140px",
  });
});

app.get("/course/fbf", requireAuth, (req, res) => {
  res.render("fbf", {
    stylesheet: "/course.css",
    title: ": Course",
    header: "140px",
  });
});

app.get("/course/front", requireAuth, (req, res) => {
  res.render("front", {
    stylesheet: "/course.css",
    title: ": Course",
    header: "140px",
  });
});

app.get("/course/back", requireAuth, (req, res) => {
  res.render("back", {
    stylesheet: "/course.css",
    title: ": Course",
    header: "140px",
  });
});

app.use(taskRoutes);
app.use(authRoutes);
