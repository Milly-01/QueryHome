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


        transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: u_email,
          subject: "Query Home: Verify Your Email to activate your accoount.",
          html: `<p>Hello ${u_name},</p>
                <p>Thank you for registering an account with QueryHome</p>
                <p>Click <a href="${verificationUrl}">here</a> to verify your email and activate your account. You will not be able to login until you do so. This link expires in 24 hours.</p>
                <br> <br> <br> <br> <br>
                <hr>
                <p><em>Support Team</em></p>
                `,
        });

        return res.json({ message: "Registration successful! Check your email and click the link to verify your email and activate your account. You will not be able to Login until you do so."});
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
// cron.schedule("0 0 * * *", () => { // every hour
//   const now = new Date();
//   db.query("DELETE FROM users WHERE is_verified = 0 AND token_expires < ?", [now], function(err, result){
//     if (err){
//      console.error(err);
//     }
//      else{
//     console.log(`Deleted ${result.affectedRows} expired unverified users`);
//      } 
// });
// });





//Login
app.post("/login", async function(req, res){

  const { u_name, u_email, u_password } = req.body;

  db.query("SELECT * FROM application_users WHERE email = ? AND name = ? ",[u_email, u_name], async function(err, results){

      if(err){
        return res.status(500).json({error:"Database error"});
      }

      if(results.length === 0){
        return res.status(401).json({error:"Invalid name, email or password"});
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



/////////////////////Compose a post
app.post("/post", function(req, res){

  const {u_title, u_post, u_email } = req.body;

  db.query("INSERT INTO post_questions (title, body, user_email) VALUES (?, ?, ?)", [u_title, u_post, u_email], function(err, result){

    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to post question"
      });
    }

    res.json({
      success: true,
      message: "Question posted successfully"
    });

  });

});



//////////////////all posts
app.get("/allposts", function(req, res){

  // const sql = `
  //   SELECT q.id, q.title, q.created_at, u.name, u.surname
  //   FROM questions q
  //   JOIN application_users u 
  //   ON q.user_email = u.email
  //   ORDER BY q.created_at DESC
  // `;

  db.query("SELECT p.id, p.title, p.body, p.user_email, p.created_at, a.name, a.surname FROM post_questions p JOIN application_users a ON p.user_email = a.email ORDER BY p.created_at DESC ", function(err, results){

    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch questions"
      });
    }

    res.json(results);

  });

});




/////////////////////Ansewrs a post
app.post("/answer", function(req, res){

  const {loc_question_id, my_answer, send_u_email_everywhere} = req.body;

  db.query("INSERT INTO answers_of_posts (question_id, body, user_email) VALUES (?, ?, ?)", [loc_question_id, my_answer, send_u_email_everywhere], function(err, result){

    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to answer question"
      });
    }

    res.json({
      success: true,
      message: "Question Answered successfully"
    });

  });

});

///////////////////////////////////////////////////////////////////

///////////////Get answers
app.get("/answers", function(req, res){

  // const sql = `
  //   SELECT q.id, q.title, q.created_at, u.name, u.surname
  //   FROM questions q
  //   JOIN application_users u 
  //   ON q.user_email = u.email
  //   ORDER BY q.created_at DESC
  // `;

  db.query("SELECT aop.id AS answer_ID, aop.question_id, aop.body, aop.user_email, aop.created_at, pq.id AS post_ID, au.name, au.surname, au.email, av.answer_id, COALESCE(SUM(CASE WHEN av.vote_type = 1 THEN 1 ELSE 0 END), 0) AS total_likes, COALESCE(SUM(CASE WHEN av.vote_type = -1 THEN 1 ELSE 0 END), 0) AS total_dislikes FROM answers_of_posts aop JOIN post_questions pq ON aop.question_id = pq.id JOIN application_users au ON aop.user_email = au.email LEFT JOIN answer_votes av ON av.answer_id = aop.id GROUP BY aop.id, aop.question_id, aop.body, aop.user_email, aop.created_at, pq.id, au.name, au.surname, au.email;", function(err, results){

    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch questions"
      });
    }

    console.log(results);
    res.json(results);

  });

});



//////////Voting
app.post("/vote-answer", function (req, res) {

  const { answerId, send_u_email_everywhere, voteType } = req.body;

  db.query(
    "SELECT * FROM answer_votes WHERE answer_id=? AND user_email=?",
    [answerId, send_u_email_everywhere],
    function (err, existingVoteRows) {

      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
      }

      // 1️⃣ User has NOT voted yet → INSERT
      if (existingVoteRows.length === 0) {

        db.query(
          "INSERT INTO answer_votes (answer_id, user_email, vote_type) VALUES (?, ?, ?)",
          [answerId, send_u_email_everywhere, voteType],
          function (err2) {
            if (err2){
              return res.status(500).json({ error: "Server error" });
            }else{
               res.json({ message: "Vote added" });
            }
           
          }
        );

      }

      // 2️⃣ User clicked SAME vote → DELETE
      else if (existingVoteRows[0].vote_type === voteType) {

        db.query(
          "DELETE FROM answer_votes WHERE answer_id=? AND user_email=?",
          [answerId, send_u_email_everywhere],
          function (err2) {
            if (err2){
               return res.status(500).json({ error: "Server error" });
            }else{
                  res.json({ message: "Vote removed" });
            }
        
          }
        );

      }

      // 3️⃣ User SWITCHED vote → UPDATE
      else {

        db.query(
          "UPDATE answer_votes SET vote_type=? WHERE answer_id=? AND user_email=?",
          [voteType, answerId, send_u_email_everywhere],
          function (err2) {
            if (err2){
              return res.status(500).json({ error: "Server error" });
            }else{
               res.json({ message: "Vote updated" });
            }
           
          }
        );

      }
    }
  );
});


/////Manage Posts
app.post("/manageposts", function(req, res){
    const {send_u_email_everywhere} = req.body;


    const query = `
    SELECT 
        pq.id AS post_ID,
        pq.title AS post_title,
        pq.body AS post_body,
        pq.created_at AS post_created_at,
        au.name AS author_name,
        au.surname AS author_surname,
        au.email AS author_email,

        -- Total answers count
        COUNT(aop.id) AS total_answers,

        -- Aggregate answers into JSON array
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'answer_ID', aop.id,
                'answer_body', aop.body,
                'answer_author_email', aop.user_email,
                'answer_created_at', aop.created_at,
                'total_likes', COALESCE(likes.total_likes, 0),
                'total_dislikes', COALESCE(likes.total_dislikes, 0),
                'user_vote', COALESCE(user_vote.user_vote, NULL)
            )
        ) AS answers

    FROM post_questions pq
    JOIN application_users au ON pq.user_email = au.email
    LEFT JOIN answers_of_posts aop ON aop.question_id = pq.id

    -- Aggregate likes/dislikes per answer
    LEFT JOIN (
        SELECT 
            answer_id,
            SUM(CASE WHEN vote_type = 1 THEN 1 ELSE 0 END) AS total_likes,
            SUM(CASE WHEN vote_type = -1 THEN 1 ELSE 0 END) AS total_dislikes
        FROM answer_votes
        GROUP BY answer_id
    ) AS likes ON likes.answer_id = aop.id

    -- Logged-in user vote per answer
    LEFT JOIN (
        SELECT answer_id, vote_type AS user_vote
        FROM answer_votes
        WHERE user_email = ?
    ) AS user_vote ON user_vote.answer_id = aop.id

    WHERE pq.user_email = ?
    GROUP BY pq.id, pq.title, pq.body, pq.created_at, au.name, au.surname, au.email
    ORDER BY pq.created_at DESC;
  `;

    db.query(query, [send_u_email_everywhere, send_u_email_everywhere], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database query failed" });
    }
    console.log(results);
    res.json(results);
  });

});






const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});