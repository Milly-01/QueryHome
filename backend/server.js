const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
//const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
require("dotenv").config();
const db = require("./db");

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));


// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const crypto = require("crypto");

function generateToken() {
  // Generates a 32-character random hex string (safe for URLs)
  return crypto.randomBytes(16).toString("hex");
}


//User Register
function generateToken() {
  return crypto.randomBytes(16).toString("hex"); // 32-char hex, URL-safe
}

//Register
app.post("/register", function(req, res){
  const { u_name, u_surname, u_email, u_password } = req.body;

  db.query("SELECT * FROM application_users WHERE email = ?", [u_email], async function(err, results){
    if (err){
         return res.status(500).json({ error: "DB error" });
    }
    if (results.length > 0){
         return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(u_password, 10);
    const token = generateToken();
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    db.query(
      "INSERT INTO application_users (name, surname, email, password, verification_token, token_expires) VALUES (?, ?, ?, ?, ?, ?)", [u_name, u_surname, u_email, hashedPassword, token, tokenExpires],
      function(err, result){
        if (err){
            return res.status(500).json({ error: "DB insert error" });
        } 

        // Build a **safe verification link**
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
        console.log("Verification link:", verificationUrl);

        transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: u_email,
          subject: "Verify Your Email",
          html: `<p>Hello ${u_name},</p>
                 <p>Click <a href="${verificationUrl}">here</a> to verify your email. This link expires in 24 hours.</p>`,
        });

        return res.json({ message: "Registration successful! Check your email and click the link to verify your account. You will not be able to Login until you do so."});
      }
    );
  });
});

// Verify
app.get("/verify/:token", (req, res) => {
  const token = req.params.token;

  db.query("SELECT * FROM application_users WHERE verification_token = ?", [token], function(err, results) {
    if (err){
        return res.status(500).json({ error: "DB error" });
    } 
    if (results.length === 0){
        return res.status(400).json({ error: "Invalid token" });
    } 

    const user = results[0];

    if (new Date(user.token_expires) < new Date()) {
      db.query("DELETE FROM application_users WHERE id = ?", [user.id]);
      return res.status(400).json({ error: "Token expired, account deleted." });
    }

    db.query(
      "UPDATE application_users SET is_verified = 1, verification_token = NULL, token_expires = NULL WHERE id = ?",[user.id], function(err){
        if (err) return res.status(500).json({ error: "DB update error" });
        return res.json({ success: true });
      }
    );
  });
});



////Delete unverified accounts
cron.schedule("0 * * * *", () => { // every hour
  const now = new Date();
  db.query("DELETE FROM users WHERE is_verified = 0 AND token_expires < ?", [now], function(err, result){
    if (err){
     console.error(err);
    }
     else{
    console.log(`Deleted ${result.affectedRows} expired unverified users`);
     } 
});
});





//Login
app.post("/login", async function(req, res){

  const { u_email, u_password } = req.body;

  db.query("SELECT * FROM application_users WHERE email = ?",[u_email], async function(err, results){

      if(err){
        return res.status(500).json({error:"Database error"});
      }

      if(results.length === 0){
        return res.status(401).json({error:"Invalid email or password"});
      }

      const user = results[0];

      // Check if email verified
      if(user.is_verified === 0){
        return res.status(403).json({
          error:"Please click the link sent to your email to verify your email before logging in."
        });
      }

      // Compare password
      const match = await bcrypt.compare(u_password, user.password);

      if(!match){
        return res.status(401).json({
          error:"Invalid email or password"
        });
      }

      // Login successful
      return res.json({
        message:"Login successful",
        user:{
          id:user.id,
          name:user.name,
          email:user.email
        }
      });

    }
  );

});
















const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});