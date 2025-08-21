import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Storage config generator
const storage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
      cb(
        null,
        folder +
          "-" +
          Date.now() +
          "-" +
          Math.round(Math.random() * 1e9) +
          path.extname(file.originalname)
      );
    },
  });

// ✅ Middlewares
export const uploadAvatar = multer({ storage: storage("avatar") });
export const uploadResume = multer({ storage: storage("resume") });
