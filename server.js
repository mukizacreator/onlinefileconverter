import express from 'express';
import { IncomingForm } from 'formidable';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(express.static('./'));
if (!fs.existsSync('./temp')) fs.mkdirSync('./temp');

app.post('/api/convert', (req, res) => {
  const form = new IncomingForm({ uploadDir: './temp', keepExtensions: true });
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Upload failed' });
    
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const format = Array.isArray(fields.format) ? fields.format[0] : fields.format;
    const outputFilename = `${Date.now()}.${format}`;
    const outputPath = path.join('./temp', outputFilename);
    
    // Use --outdir and verify the file exists after conversion
    const cmd = `soffice --headless --convert-to ${format} "${file.filepath}" --outdir ./temp`;
    
    exec(cmd, (error) => {
      if (error) {
        console.error("Conversion Error:", error);
        return res.status(500).json({ error: "Conversion process failed." });
      }
      res.json({ url: `/download/${outputFilename}` });
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

app.listen(8080);