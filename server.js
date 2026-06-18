// ... (imports remain the same) ...
const SUPPORTED_FORMATS = ['pdf', 'jpg', 'png', 'docx', 'mp3', 'webp', 'txt', 'epub'];

app.post('/api/convert', (req, res) => {
  form.parse(req, (err, fields, files) => {
    // ... (parsing and validation remains the same) ...

    let cmd = '';
    if (format === 'mp3') {
        cmd = `ffmpeg -i "${file.filepath}" -vn -acodec libmp3lame -q:a 2 "${outputPath}"`;
    } else {
        cmd = `soffice --headless --convert-to ${format} "${file.filepath}" --outdir ./temp`;
    }

    exec(cmd, { timeout: 45000 }, (error) => {
      if (error) return res.status(500).json({ error: "Conversion failed." });
      
      // For ffmpeg, the file is already at outputPath. For soffice, we detect it.
      if (format !== 'mp3') {
        const filesInTemp = fs.readdirSync('./temp');
        const convertedFile = filesInTemp.find(f => f.endsWith(`.${format}`) && f !== outputFilename);
        if (convertedFile) fs.renameSync(path.join('./temp', convertedFile), outputPath);
      }
      
      res.json({ url: `/download/${outputFilename}` });
    });
  });
});