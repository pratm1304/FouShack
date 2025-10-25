import multer from "multer";

// Upload storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

// File filter (sirf images allow)
const fileFilter = (req, file, cb) => {
  if(file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

export const upload = multer({ storage, fileFilter });
