import multer from "multer";
import path from "path";
import { v4 as uuid } from "uuid";

// Settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, "public/videos");
    } else {
      cb(null, "public/images");
    }
  },
  filename: (req, file, cb) => {
    cb(null, uuid() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export default upload;
