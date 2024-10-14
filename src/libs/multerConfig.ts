// multerConfig.ts
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";

    // Verifica si la carpeta existe, si no, la crea
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    cb(null, dir); // Carpeta donde se almacenan las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Nombre único para la imagen
  },
});

// Filtros para asegurar que solo se suban imágenes
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Archivo aceptado
  } else {
    cb(new Error("Solo se permiten imágenes")); // Error si no es una imagen
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
