import express from 'express';
import { IncomingForm } from 'formidable';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static('./'));

// Ensure the temp directory exists at runtime
const TEMP_DIR = path.join(os.tmpdir(), 'conv_files');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

app.post('/api/convert', (req, res) => {
  const form = new IncomingForm({ uploadDir: TEMP_DIR, keepExtensions: true });
  
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Upload failed' });
    
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const format = (Array.isArray(fields.format) ? fields.format[0] : fields.format).toLowerCase();
    
    // Simplest command to avoid memory overhead
    const cmd = `soffice --headless --convert-to ${format} --outdir "${TEMP_DIR}" "${file.filepath}"`;
    
    exec(cmd, { timeout: 30000 }, (error) => {
      if (error) return res.status(500).json({ error: "Conversion failed." });

      const baseName = path.parse(file.newFilename).name;
      const expectedFile = path.join(TEMP_DIR, `${baseName}.${format}`);

      if (fs.existsSync(expectedFile)) {
        res.json({ url: `/download/${path.basename(expectedFile)}` });
      } else {
        res.status(500).json({ error: "File not found." });
      }
    });
  });
});

app.get('/download/:filename', (req, res) => {
  const filePath = path.join(TEMP_DIR, req.params.filename);
  if (fs.existsSync(filePath)) res.download(filePath);
});

app.listen(PORT, () => console.log(`Converter running on port ${PORT}`));