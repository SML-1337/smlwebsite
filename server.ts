import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API route for form submission
  app.post("/api/quote", async (req, res) => {
    const { name, email, service, message } = req.body;

    console.log(`Received quote request from ${name} (${email}) for ${service}`);

    try {
      // 1. Send Email
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = (process.env.SMTP_PASS || "").trim();
      
      if (smtpUser && smtpPass) {
        const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
        const isGmail = smtpHost.includes("gmail.com");

        console.log(`Attempting to send email via ${isGmail ? 'Gmail' : smtpHost}`);
        console.log(`User: ${smtpUser}`);

        const transporterOptions: any = {
          host: smtpHost,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === "true" || (process.env.SMTP_PORT === "465"),
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            rejectUnauthorized: false
          },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 10000,
        };

        // Use Gmail service shortcut for better reliability
        if (isGmail) {
          delete transporterOptions.host;
          delete transporterOptions.port;
          delete transporterOptions.secure;
          transporterOptions.service = "gmail";
        }

        const transporter = nodemailer.createTransport(transporterOptions);

        await transporter.sendMail({
          from: `"Split Second Services" <${smtpUser}>`,
          to: "spencer@splitsecondservices.com",
          subject: `New Quote Request: ${service}`,
          text: `Name: ${name}\nEmail: ${email}\nService: ${service}\nMessage: ${message}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #FF6321;">New Quote Request</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Service:</strong> ${service}</p>
              <p><strong>Message:</strong></p>
              <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
          `,
        });
        console.log("Email sent successfully");
      } else {
        console.warn("Email not sent. Missing SMTP_USER or SMTP_PASS.");
        return res.status(500).json({ 
          error: "Service Temporarily Unavailable", 
          details: "The website owner has not finished setting up the email system. Please contact them directly at (603) 722-3494." 
        });
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error sending notification:", error);
      
      let errorMessage = "Failed to send notification";
      let errorDetails = error instanceof Error ? error.message : String(error);

      // Specific handling for Gmail "BadCredentials" error
      if (errorDetails.includes("BadCredentials") || errorDetails.includes("535-5.7.8")) {
        const pass = (process.env.SMTP_PASS || "").trim();
        const passLength = pass.length;
        
        errorMessage = "Gmail Login Failed";
        errorDetails = `Google rejected your login. Since you are using Gmail, you MUST use an "App Password" instead of your regular password.\n\n` +
          `DEBUG INFO:\n- Your current password length is ${passLength} characters.\n` +
          `- A Google App Password is ALWAYS exactly 16 characters long.\n\n` +
          `HOW TO FIX:\n1. Enable 2-Step Verification in your Google Account.\n2. Search for "App Passwords" in Google Settings.\n3. Create a new one and use that 16-character code in the AI Studio Secrets panel for SMTP_PASS.`;
      }

      res.status(500).json({ 
        error: errorMessage, 
        details: errorDetails 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
