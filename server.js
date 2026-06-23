/* ============================================
   IMPORTS AND CONFIGURATION
   ============================================ */
// Core dependencies for web server, file handling, shell commands, and email
import express from "express";
import { IncomingForm } from "formidable";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware: Parse JSON and serve static files (HTML, CSS, JS)
app.use(express.json());
app.use(express.static("./"));

// Create temp directory for file processing if it doesn't exist
if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");

/* ============================================
   CONSTANTS AND SERVICES
   ============================================ */
// List of all supported output formats for validation
const SUPPORTED_FORMATS = ["pdf", "jpg", "png", "docx", "webp", "txt", "epub", "tiff", "bmp", "gif", "doc", "odt", "rtf", "html"];

// In-memory storage for verification codes (email -> code mapping)
const verificationCodes = {};

// Email transporter configured for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

/* ============================================
   API: EMAIL VERIFICATION
   ============================================ */
// Generates a 6-digit code, stores it temporarily, and emails it to the user
app.post("/api/send-code", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email required." });
    }

    // Validate email format
    if (!email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes[email] = code;
    
    // Log for debugging
    console.log(`Verification code for ${email}: ${code}`);

    // Attempt to send email
    const mailOptions = {
      from: `"Online File Converter" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #1a1a2e; border-radius: 15px; color: #ffffff;">
          <h2 style="color: #00bcd4; text-align: center;">Online File Converter</h2>
          <p style="text-align: center; font-size: 16px;">Your verification code is:</p>
          <div style="text-align: center; font-size: 36px; font-weight: bold; color: #00bcd4; background: rgba(0,188,212,0.1); padding: 20px; border-radius: 10px; letter-spacing: 8px;">
            ${code}
          </div>
          <p style="text-align: center; color: #888; font-size: 14px; margin-top: 20px;">This code will expire in 5 minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
    res.json({ success: true, message: "Verification code sent." });
    
  } catch (error) {
    console.error("Email send error:", error.message);
    // Return more specific error
    if (error.message.includes('Invalid login')) {
      res.status(500).json({ error: "Email service not configured properly. Please check EMAIL_USER and EMAIL_PASS." });
    } else {
      res.status(500).json({ error: `Failed to send verification email: ${error.message}` });
    }
  }
});

// Verifies the code provided by the user and removes it from storage
app.post("/api/verify-code", (req, res) => {
  const { email, code } = req.body;
  if (!email || !code || verificationCodes[email] !== code) {
    return res.json({ success: false });
  }
  delete verificationCodes[email]; // Code is single-use
  res.json({ success: true });
});

/* ============================================
   API: FILE CONVERSION
   ============================================ */
// Handles file upload, validates format, executes conversion, and returns download URL
app.post("/api/convert", (req, res) => {
  // Parse incoming multipart form data with 20MB limit
  const form = new IncomingForm({ uploadDir: "./temp", keepExtensions: true, maxFileSize: 20 * 1024 * 1024 });

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload failed" });

    // Extract file and target format from form data
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const format = (Array.isArray(fields.format) ? fields.format[0] : fields.format).toLowerCase();
    const currentExt = path.extname(file.originalFilename).toLowerCase().replace(".", "");

    // VALIDATION 1: File is already in the target format
    if (currentExt === format) return res.status(400).json({ error: `File is already in ${format.toUpperCase()} format.` });
    
    // VALIDATION 2: Target format is supported
    if (!SUPPORTED_FORMATS.includes(format)) return res.status(400).json({ error: "Format not supported." });

    // Generate unique output filename
    const outputFilename = `${Date.now()}.${format}`;
    const outputPath = path.join("./temp", outputFilename);
    
    // Select conversion tool based on format type
    // Audio formats use FFmpeg, all others use LibreOffice (soffice)
    // Use LibreOffice for all conversions (audio removed due to resource constraints)
    const cmd = `soffice --headless --convert-to ${format} "${file.filepath}" --outdir ./temp`;

    // Execute conversion command with 45-second timeout
    exec(cmd, { timeout: 45000 }, (error) => {
      if (error) return res.status(500).json({ error: "Conversion failed." });

      // Handle file naming: LibreOffice generates unpredictable filenames, so we find and rename it
      if (!["mp3", "wav", "ogg"].includes(format)) {
        const filesInTemp = fs.readdirSync("./temp");
        const convertedFile = filesInTemp.find((f) => f.endsWith(`.${format}`) && f !== outputFilename);
        if (convertedFile) fs.renameSync(path.join("./temp", convertedFile), outputPath);
      }
      // Return download URL for the converted file
      res.json({ url: `/download/${outputFilename}` });
    });
  });
});

/* ============================================
   API: FILE DOWNLOAD
   ============================================ */
// Provides the converted file to the user and cleans up the temporary file immediately after
app.get("/download/:filename", (req, res) => {
  const filePath = path.join("./temp", req.params.filename);
  if (fs.existsSync(filePath)) {
    // Send file for download
    res.download(filePath, (err) => {
      // Only delete if no error occurred during download
      if (!err) {
        // Schedule cleanup after 5 seconds to ensure download completes
        setTimeout(() => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }, 5000);
      }
    });
  } else {
    res.status(404).send("File not found or already expired.");
  }
});

/* ============================================
   SCHEDULED CLEANUP (every 5 minutes)
   ============================================ */
// Remove files older than 5 minutes to prevent disk accumulation
setInterval(() => {
  const now = Date.now();
  const files = fs.readdirSync("./temp");
  files.forEach((file) => {
    const filePath = path.join("./temp", file);
    const stats = fs.statSync(filePath);
    // Remove files older than 5 minutes (300000 ms)
    if (now - stats.mtimeMs > 300000) {
      try {
        fs.unlinkSync(filePath);
        console.log(`Cleaned up old file: ${file}`);
      } catch (e) {
        // File might be in use
      }
    }
  });
}, 300000); // Run every 5 minutes


/* ============================================
   SERVER STARTUP
   ============================================ */
// Start the Express server and log the port
app.listen(PORT, () => console.log(`Converter running on port ${PORT}`));