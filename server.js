import express from 'express';
import { IncomingForm } from 'formidable';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static('./'));

const TEMP_DIR = path.join(os.tmpdir(), 'conv_files');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

app.post('/api/convert', (req, res) => {
  const form = new IncomingForm({ uploadDir: TEMP_DIR, keepExtensions: true });
  
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Upload failed' });
    
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const format = (Array.isArray(fields.format) ? fields.format[0] : fields.format).toLowerCase();
    const profileDir = path.join(TEMP_DIR, 'prof_' + Date.now());

    // Capture start time to find the file created by LibreOffice
    const startTime = Date.now();
    const cmd = `soffice -env:UserInstallation=file://${profileDir} --headless --convert-to ${format} --outdir "${TEMP_DIR}" "${file.filepath}"`;
    
    exec(cmd, { timeout: 60000 }, (error) => {
      if (fs.existsSync(profileDir)) fs.rmSync(profileDir, { recursive: true, force: true });
      
      if (error) {
        console.error("Conversion Error:", error);
        return res.status(500).json({ error: "Conversion failed. File may be unsupported." });
      }

      // Find the file that was just created by looking for the newest file matching the extension
      const filesInTemp = fs.readdirSync(TEMP_DIR);
      let convertedFile = null;
      let newestTime = 0;

      filesInTemp.forEach(f => {
        const filePath = path.join(TEMP_DIR, f);
        const stats = fs.statSync(filePath);
        if (f.endsWith(`.${format}`) && stats.mtimeMs >= startTime) {
          if (stats.mtimeMs > newestTime) {
            newestTime = stats.mtimeMs;
            convertedFile = filePath;
          }
        }
      });

      if (convertedFile) {
        const finalName = `${Date.now()}.${format}`;
        const finalPath = path.join(TEMP_DIR, finalName);
        fs.renameSync(convertedFile, finalPath);
        res.json({ url: `/download/${finalName}` });
      } else {
        res.status(500).json({ error: "Conversion succeeded but result file not detected." });
      }
    });
  });
});

app.get('/download/:filename', (req, res) => {
  const filePath = path.join(TEMP_DIR, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath, (err) => {
      if (!err) setTimeout(() => { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); }, 300000);
    });
  } else {
    res.status(404).send('File expired.');
  }
});

app.listen(PORT, () => console.log(`Converter running on port ${PORT}`));