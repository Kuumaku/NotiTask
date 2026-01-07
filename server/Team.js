import express from "express";
import pool from "./db.js";

export const getTeamMembers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM team_members");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getTeamByProject = async (req, res) => {
  try {
    const { project_id } = req.params;
    const result = await pool.query(
      "SELECT * FROM team_members WHERE project_id = $1",
      [project_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const addTeamMember = async (req, res) => {
  try {
    const { user_id, project_id, team_member_name, role } = req.body;
    const result = await pool.query(
      `INSERT INTO team_members (user_id, project_id, team_member_name, role) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, project_id, team_member_name, role]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { team_member_name, role } = req.body;
    const result = await pool.query(
      `UPDATE team_members SET team_member_name = $1, role = $2 WHERE team_member_id = $3 RETURNING *`,
      [team_member_name, role, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM team_members WHERE team_member_id = $1", [id]);
    res.json("Team member deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//get user_info
export const GetUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT user_fname FROM user_info WHERE user_id = $1",
      [id]
    );
    res.json(result.rows); // Return the user data
  } catch (error) {
    console.log(error.message);
  }
};
