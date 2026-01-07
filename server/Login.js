import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Create Account
export const CreateAcc = async(req, res) => {
    try {
        const { user_fname, user_lname, email, pass} = req.body;
        const newUser = await pool.query(
          "INSERT INTO user_info (user_fname, user_lname, email, pass) VALUES($1, $2, $3, $4 ) RETURNING *",
          [user_fname, user_lname, email, pass]
        );
        res.json(newUser.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
}

// Log in 
export const LogIn = async (req, res) => {
  try {
    const { email, pass } = req.body;
    const result = await pool.query(
      "SELECT * FROM user_info WHERE email = $1 AND pass = $2",
      [email, pass]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Server error" });
  }
};
