import express from 'express';
import { uploadFile } from '../controllers/fileUpload.controller';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'temp/' });

router.post('/', upload.single('file'), uploadFile);

export default router;
