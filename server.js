import express from 'express';
import { IncomingForm } from 'formidable';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

const app = express();
const PORT = process.env.PORT || 10000; // Render expects this port

app.use(express.static('./'));

const TEMP_DIR = path.join(os.tmpdir(), 'conv_temp');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const SUPPORTED_FORMATS = ['pdf', 'jpg', 'png', 'docx', 'mp3', 'webp', 'txt', 'epub', 'wav', 'ogg', 'tiff', 'bmp', 'gif', 'doc', 'odt', 'rtf', 'html'];

app.post('/api/convert', (req, res) => {
  const form = new IncomingForm({ uploadDir: TEMP_DIR, keepExtensions: true, maxFileSize: 20 * 1024 * 1024 });
  
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Upload failed' });
    
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const format = (Array.isArray(fields.format) ? fields.format[0] : fields.format).toLowerCase();
    
    const outputFilename = `${Date.now()}.${format}`;
    const outputPath = path.join(TEMP_DIR, outputFilename);
    
    let cmd = '';
    if (['mp3', 'wav', 'ogg'].includes(format)) {
        cmd = `ffmpeg -i "${file.filepath}" -vn -acodec libmp3lame -q:a 2 "${outputPath}"`;
    } else {
        // Use a dedicated user profile dir to prevent LibreOffice permission crashes
        const profileDir = path.join(TEMP_DIR, 'profile_' + Date.now());
        cmd = `soffice -env:UserInstallation=file://${profileDir} --headless --convert-to ${format} "${file.filepath}" --outdir "${TEMP_DIR}"`;
    }
    
    exec(cmd, { timeout: 60000 }, (error) => {
      if (error) {
        console.error("Conversion Error:", error);
        return res.status(500).json({ error: "Conversion failed. Please ensure the file is not password protected." });
      }

      const baseName = path.parse(file.newFilename).name;
      const expectedFile = path.join(TEMP_DIR, `${baseName}.${format}`);

      if (fs.existsSync(expectedFile)) {
        fs.renameSync(expectedFile, outputPath);
        res.json({ url: `/download/${outputFilename}` });
      } else {
        res.status(500).json({ error: "Conversion finished, but output file not found." });
      }
    });
  });
});

app.get('/download/:filename', (req, res) => {
  const filePath = path.join(TEMP_DIR, req.params.filename);
  if (fs.existsSync(filePath)) {
    // Send file and schedule deletion for 10 minutes later
    res.download(filePath, (err) => {
      if (!err) {
        setTimeout(() => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }, 600000); 
      }
    });
  } else {
    res.status(404).send('File expired.');
  }
});

app.listen(PORT, () => console.log(`Converter running on port ${PORT}`));