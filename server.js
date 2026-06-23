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

/* ============================================
   SECURITY HEADERS
   ============================================ */
// Add security headers to prevent browser warnings
app.use((req, res, next) => {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Strict Transport Security (force HTTPS)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
});

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
    
    // Log for debugging (will show in Render logs)
    console.log(`📧 Verification code for ${email}: ${code}`);

    // Attempt to send email
    const mailOptions = {
      from: `"Online File Converter" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #1a1a2e; border-radius: 15px; color: #ffffff;">
          <h2 style="color: #00bcd4; text-align: center;">🔐 Online File Converter</h2>
          <p style="text-align: center; font-size: 16px;">Your verification code is:</p>
          <div style="text-align: center; font-size: 36px; font-weight: bold; color: #00bcd4; background: rgba(0,188,212,0.1); padding: 20px; border-radius: 10px; letter-spacing: 8px; margin: 20px 0;">
            ${code}
          </div>
          <p style="text-align: center; color: #888; font-size: 14px;">This code will expire in 5 minutes.</p>
          <p style="text-align: center; color: #555; font-size: 12px; margin-top: 30px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
    res.json({ success: true, message: "Verification code sent." });
    
  } catch (error) {
    console.error("❌ Email send error:", error.message);
    
    // Return more specific error messages
    if (error.message.includes('Invalid login') || error.message.includes('authentication')) {
      res.status(500).json({ error: "Email service not configured properly. Please contact support." });
    } else if (error.message.includes('timeout')) {
      res.status(500).json({ error: "Email service timeout. Please try again." });
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
  if (error) {
    console.error("Conversion error:", error.message);
    return res.status(500).json({ error: "Conversion failed." });
  }

  // Handle file naming: LibreOffice generates unpredictable filenames, so we find and rename it
  const filesInTemp = fs.readdirSync("./temp");
  const convertedFile = filesInTemp.find((f) => f.endsWith(`.${format}`) && f !== outputFilename);
  if (convertedFile) {
    try {
      fs.renameSync(path.join("./temp", convertedFile), outputPath);
      console.log(`File renamed from ${convertedFile} to ${outputFilename}`);
    } catch (renameErr) {
      console.error("Rename error:", renameErr.message);
      return res.status(500).json({ error: "Failed to process converted file." });
    }
  } else {
    // If no file was found with the expected extension, check if the original output exists
    if (!fs.existsSync(outputPath)) {
      console.error(`No output file found for format: ${format}`);
      return res.status(500).json({ error: "Conversion completed but output file not found." });
    }
  }
  
  // Return download URL for the converted file
  res.json({ url: `/download/${outputFilename}` });
  });
  });
});

/* ============================================
   API: FILE DOWNLOAD
   ============================================ */
// Provides the converted file to the user without immediate deletion
// Files are cleaned up by a scheduled job instead
app.get("/download/:filename", (req, res) => {
  const filePath = path.join("./temp", req.params.filename);
  if (fs.existsSync(filePath)) {
    // Send file for download - don't delete immediately
    res.download(filePath, (err) => {
      if (err) {
        console.error(`Download error for ${req.params.filename}:`, err.message);
      }
      // File will be cleaned up by scheduled job
    });
  } else {
    res.status(404).send("File not found or already expired.");
  }
});

/* ============================================
   SCHEDULED FILE CLEANUP
   ============================================ */
// Remove files older than 10 minutes to prevent disk accumulation
// This gives users plenty of time to download their files
setInterval(() => {
  const now = Date.now();
  const maxAge = 10 * 60 * 1000; // 10 minutes
  
  try {
    const files = fs.readdirSync("./temp");
    let cleanedCount = 0;
    
    files.forEach((file) => {
      const filePath = path.join("./temp", file);
      try {
        const stats = fs.statSync(filePath);
        // Remove files older than maxAge
        if (now - stats.mtimeMs > maxAge) {
          fs.unlinkSync(filePath);
          cleanedCount++;
        }
      } catch (statErr) {
        // File might have been deleted already
      }
    });
    
    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} old file(s) from temp directory`);
    }
  } catch (err) {
    console.error("Cleanup error:", err.message);
  }
}, 5 * 60 * 1000); // Run every 5 minutes


/* ============================================
   SERVER STARTUP
   ============================================ */
// Start the Express server and log the port
app.listen(PORT, () => console.log(`Converter running on port ${PORT}`));