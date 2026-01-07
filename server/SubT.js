import express from "express";
import cors from "cors";
import pool from "./db.js";


const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());
app.use(cors());

//Get all sub tasks
export const getAllSub = async (req,res) => {
    try {
        const {id} = req.params;
        const Allsubs = await pool.query(`SELECT * FROM task`)
        res.json(Allsubs.rows);
    } catch (error) {
        console.log(error.message);
    }
};

//Add sub tasks 
export const createSub = async (req, res) => {
  try {
    const { t_name, due_date, project_id, s_description } = req.body;

    const newSub = await pool.query(
      `INSERT INTO task (t_name, s_due_date, project_id, s_description) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
      [t_name, due_date, project_id, s_description]
    );

    res.json(newSub.rows[0]);
  } catch (error) {
    console.log("Error in createSub:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

//delete sub tasks
export const deleteSub = async (req, res) => {
    try {
        const {id} = req.params;
        await pool.query(`DELETE FROM task WHERE task_id = $1`,[id]);
        res.json(`project deleted`);
    } catch (error) {
        console.log(error.message);
    }
};

// Edit sub task
// Edit subtask
// Edit subtask
export const EditSub = async (req, res) => {
  try {
    const { id } = req.params;
    const { t_name, due_date, project_id, s_description, status, task_type } = req.body;

    // Log the incoming request body to check the fields
    console.log("Received body:", req.body);

    const allowedFields = {
      t_name,
      s_due_date: due_date,
      project_id,
      s_description,
      status,
      task_type,
    };

    // Filter out undefined values
    const entries = Object.entries(allowedFields).filter(
      ([_, value]) => value !== undefined
    );

    // Log the filtered fields
    console.log("Filtered fields for update:", entries);

    if (entries.length === 0) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    // Dynamically create the SET clause
    const setClause = entries
      .map(([key], index) => `${key} = $${index + 1}`)
      .join(", ");

    // Create the array of values
    const values = entries.map(([_, value]) => value);
    values.push(id); // Add the task_id to the end for WHERE clause

    // Construct the SQL query
    const query = `UPDATE task SET ${setClause} WHERE task_id = $${values.length} RETURNING *`;

    // Execute the query
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.log("Error in EditSub:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};


 


