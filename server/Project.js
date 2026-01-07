import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.end("Hello From Backend");
});

// Create Project
export const createProj =  async (req, res) => {
  try {
    const { project_name, description, start_date, due_date, user_id } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO project (project_name, description, start_date, due_date, user_id) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [project_name, description, start_date, due_date, user_id]
    );
    res.json(newTodo.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
};

// Get All Todos
export const GetAllProj = async (req, res) => {
  try {
    const { user_id } = req.query;
    let result;

    if (user_id) {
      result = await pool.query(
        `
        SELECT DISTINCT p.*
        FROM project p
        LEFT JOIN team_members tm ON p.project_id = tm.project_id
        WHERE p.user_id = $1 OR tm.user_id = $1
        `,
        [user_id]
      );
    } else {
      result = await pool.query("SELECT * FROM project");
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};


// Get Single Todo
export const GetProj = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query(
      "SELECT * FROM project WHERE project_id = $1",
      [id]
    );
    res.json(todo.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
};

// Update Todo
export const UpdateProj =  async (req, res) => {
  try {
    const { id } = req.params;
    const { project_name, description, status, start_date, due_date } =
      req.body;

    console.log("Updating project with:", req.body);

    let query = "UPDATE project SET ";
    let values = [];
    let index = 1;

    if (project_name !== undefined) {
      query += `project_name = $${index}, `;
      values.push(project_name);
      index++;
    }
    if (description !== undefined) {
      query += `description = $${index}, `;
      values.push(description);
      index++;
    }
    if (status !== undefined) {
      query += `status = $${index}, `;
      values.push(status);
      index++;
    }
    if (start_date !== undefined) {
      query += `start_date = $${index}, `;
      values.push(start_date);
      index++;
    }
    if (due_date !== undefined) {
      query += `due_date = $${index}, `;
      values.push(due_date);
      index++;
    }

    if (values.length === 0) {
      return res.status(400).send("No fields provided for update");
    }

    query = query.slice(0, -2); // Remove trailing comma
    query += ` WHERE project_id = $${index} RETURNING *`;
    values.push(id);

    const updatedTodo = await pool.query(query, values);
    res.json(updatedTodo.rows[0]);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
};

// Delete Todo
export const DeleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM project WHERE project_id = $1", [id]);
    res.json("Project Deleted");
  } catch (error) {
    console.log(error.message);
  }
};

// app.listen(PORT, () => {
//   console.log("Server is running on port " + PORT);
// });
