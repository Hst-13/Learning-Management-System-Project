const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

const conn = mongoose.connection;
let gfs;
conn.once("open", () => {
  // Init stream
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

const image_up = (req, res) => {
  // res.json({ file: req.file });
  res.redirect("/signup");
};

const file_display = (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }
    // File exists
    return res.json(file);
  });
};

const image_display = (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }

    // Check if image
    if (file.contentType.split("/")[0] === "image") {
      // Read output to browser
      const readstream = gridfsBucket.openDownloadStream(file._id);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image",
      });
    }
  });
};

const image_delete = (req, res) => {
  const ObjectId = mongoose.Types.ObjectId;
  gfs.db
    .collection("uploads.chunks")
    .deleteMany({ files_id: ObjectId(req.params.id) }, (err, gridStore) => {
      console.log("Chunk Deleted!!");
    });
  gfs.files.deleteOne({ _id: ObjectId(req.params.id) }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    res.json({ redirect: "/signup" });
  });
};

const profile_image_up = (req, res) => {
  // res.json({ file: req.file });
  res.redirect("/profile");
};

const profile_image_delete = (req, res) => {
  const ObjectId = mongoose.Types.ObjectId;
  gfs.db
    .collection("uploads.chunks")
    .deleteMany({ files_id: ObjectId(req.params.id) }, (err, gridStore) => {
      console.log("Chunk Deleted!!");
    });
  gfs.files.deleteOne({ _id: ObjectId(req.params.id) }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    res.json({ redirect: "/profile" });
  });
};

module.exports = {
  image_up,
  file_display,
  image_display,
  image_delete,
  profile_image_up,
  profile_image_delete,
};
