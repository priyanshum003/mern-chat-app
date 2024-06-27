import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import cloudinary from '../config/cloudinaryConfig';
import fs from 'fs';

interface MulterRequest extends Request {
    file: any;
}

export const uploadFile = asyncHandler(async (req: MulterRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'auto',
        });

        // Delete the file from the server after uploading to Cloudinary
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                url: result.secure_url,
                public_id: result.public_id,
            },
        });
    } catch (error) {
        console.error('File upload failed:', error);  // Log error details to the console
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});
