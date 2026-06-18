import express from 'express';
import { IncomingForm } from 'formidable';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(express.static('./'));
if (!fs.existsSync('./temp')) fs.mkdirSync('./temp');

// List of "Lightweight" formats your server can handle safely
const SUPPORTED_FORMATS = ['pdf', 'jpg', 'png', 'docx', 'odt', 'txt', 'webp', 'html', 'rtf'];

app.post('/api/convert', (req, res) => {
  const form = new IncomingForm({ uploadDir: './temp', keepExtensions: true });
  
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Upload failed' });
    
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const format = (Array.isArray(fields.format) ? fields.format[0] : fields.format).toLowerCase();
    const currentExt = path.extname(file.originalFilename).toLowerCase().replace('.', '');

    // 1. Validation: Prevent same-format conversion
    if (currentExt === format) {
      return res.status(400).json({ error: `File is already in ${format.toUpperCase()} format.` });
    }

    // 2. Validation: Ensure we support the format
    if (!SUPPORTED_FORMATS.includes(format)) {
      return res.status(400).json({ error: "Format not supported for performance reasons." });
    }

    const outputFilename = `${Date.now()}.${format}`;
    const outputPath = path.join('./temp', outputFilename);
    
    // Convert command
    const cmd = `soffice --headless --convert-to ${format} "${file.filepath}" --outdir ./temp`;
    
    exec(cmd, { timeout: 30000 }, (error) => { // 30s timeout prevents CPU hogging
      if (error) return res.status(500).json({ error: "Conversion failed." });

      const filesInTemp = fs.readdirSync('./temp');
      const convertedFile = filesInTemp.find(f => f.endsWith(`.${format}`) && f !== outputFilename);

      if (convertedFile) {
        fs.renameSync(path.join('./temp', convertedFile), outputPath);
        res.json({ url: `/download/${outputFilename}` });
      } else {
        res.status(500).json({ error: "Output file not found." });
      }
    });
  });
});

app.get('/download/:filename', (req, res) => {
  const filePath = path.join('./temp', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath, () => fs.unlinkSync(filePath));
  } else {
    res.status(404).send('File expired.');
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT);