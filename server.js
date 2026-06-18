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
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

app.post('/api/convert', (req, res) => {
  const form = new IncomingForm({ uploadDir: TEMP_DIR, keepExtensions: true, maxFileSize: 20 * 1024 * 1024 });
  
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Upload failed' });
    
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const format = (Array.isArray(fields.format) ? fields.format[0] : fields.format).toLowerCase();
    
    const outputFilename = `${Date.now()}.${format}`;
    const outputPath = path.join(TEMP_DIR, outputFilename);
    
    // Create a specific profile for this instance to avoid permission conflicts
    const profileDir = path.join(TEMP_DIR, 'profile_' + Date.now());
    const cmd = `soffice -env:UserInstallation=file://${profileDir} --headless --convert-to ${format} --outdir "${TEMP_DIR}" "${file.filepath}"`;
    
    exec(cmd, { timeout: 60000 }, (error, stdout, stderr) => {
      // Cleanup
      if (fs.existsSync(profileDir)) fs.rmSync(profileDir, { recursive: true, force: true });
      
      if (error) {
        console.error("Conversion Error:", stderr);
        return res.status(500).json({ error: "Conversion failed. The file may be encrypted/password-protected." });
      }

      // Find the file by looking for the one that matches our format extension
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
    res.download(filePath, (err) => {
      if (!err) {
        // Schedule deletion 10 minutes later
        setTimeout(() => { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); }, 600000);
      }
    });
  } else {
    res.status(404).send('File expired.');
  }
});

app.listen(PORT, () => console.log(`Converter running on port ${PORT}`));