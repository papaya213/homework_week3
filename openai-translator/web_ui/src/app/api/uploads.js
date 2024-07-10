import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    const uploadDir = path.join(process.cwd(), '/uploads');

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    form.uploadDir = uploadDir;
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const file = files.file;
      const filePath = path.join(uploadDir, file.newFilename);

      fs.rename(file.filepath, filePath, (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.status(200).json({ message: 'File uploaded successfully', filePath });
      });
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

