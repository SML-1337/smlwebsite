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
      // In Production (Cloud Run), these MUST be set in the Environment Variables section
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = (process.env.SMTP_PASS || "").trim();
      const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
      
      if (smtpUser && smtpPass) {
        const isGmail = smtpHost.includes("gmail.com") || smtpHost.includes("googlemail.com");

        console.log(`[MAIL] Attempting to send email via ${isGmail ? 'Gmail Service' : smtpHost}`);
        console.log(`[MAIL] Authenticating as: ${smtpUser}`);

        const transporterOptions: any = {
          host: smtpHost,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === "true" || (process.env.SMTP_PORT === "465"),
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            // This helps bypass issues with some hosting providers' certificates
            rejectUnauthorized: false,
            minVersion: 'TLSv1.2'
          },
          connectionTimeout: 10000, // 10 seconds
          greetingTimeout: 10000,
          socketTimeout: 10000,
        };

        // Use Gmail service shortcut for better reliability if it's a Google-hosted account
        if (isGmail) {
          console.log("[MAIL] Using Gmail Service shortcut for optimized delivery");
          delete transporterOptions.host;
          delete transporterOptions.port;
          delete transporterOptions.secure;
          transporterOptions.service = "gmail";
        }

        const transporter = nodemailer.createTransport(transporterOptions);

        // Verify connection configuration
        try {
          await transporter.verify();
          console.log("[MAIL] SMTP Connection verified successfully");
        } catch (verifyError) {
          console.error("[MAIL] SMTP Verification Failed:", verifyError);
          throw verifyError;
        }

        await transporter.sendMail({
          from: `"Split Second Services" <${smtpUser}>`,
          to: "spencer@splitsecondservices.com",
          replyTo: email, // So you can just hit 'Reply' to the customer
          subject: `New Quote Request: ${service}`,
          text: `Name: ${name}\nEmail: ${email}\nService: ${service}\nMessage: ${message}`,
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; background-color: #f4f4f4;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border: 1px solid #e0e0e0;">
                <div style="background-color: #141414; padding: 30px; text-align: center; border-bottom: 4px solid #FF6321;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: -1px; font-weight: 900;">SPLIT SECOND <span style="color: #FF6321;">SERVICES</span></h1>
                </div>
                <div style="padding: 40px;">
                  <h2 style="color: #141414; margin-top: 0; font-size: 20px; font-weight: 800;">NEW QUOTE REQUEST</h2>
                  <div style="margin: 30px 0; border-left: 4px solid #FF6321; padding-left: 20px;">
                    <p style="margin: 10px 0; color: #666;"><strong style="color: #141414; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Customer Name:</strong><br><span style="font-size: 16px; color: #141414;">${name}</span></p>
                    <p style="margin: 10px 0; color: #666;"><strong style="color: #141414; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Email Address:</strong><br><span style="font-size: 16px; color: #141414;">${email}</span></p>
                    <p style="margin: 10px 0; color: #666;"><strong style="color: #141414; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Service Requested:</strong><br><span style="font-size: 16px; color: #141414;">${service}</span></p>
                  </div>
                  <div style="background-color: #f9f9f9; padding: 25px; border-radius: 12px; border: 1px solid #eee;">
                    <strong style="color: #141414; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; display: block; margin-bottom: 10px;">Message:</strong>
                    <p style="margin: 0; color: #444; line-height: 1.6; font-size: 15px;">${message.replace(/\n/g, '<br>')}</p>
                  </div>
                </div>
                <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888;">
                  This is an automated notification from your website.
                </div>
              </div>
            </div>
          `,
        });
        console.log("[MAIL] Email sent successfully to spencer@splitsecondservices.com");
      } else {
        console.warn("[MAIL] Email not sent. Missing SMTP_USER or SMTP_PASS environment variables.");
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
