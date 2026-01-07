import express from "express";
import { GetAllProj , GetProj, DeleteTodo, UpdateProj, createProj} from "./Project.js";
import cors from "cors";
import { getAllSub, deleteSub, createSub, EditSub  } from "./SubT.js";
import { CreateAcc, LogIn } from "./Login.js";
import {
  getTeamMembers,
  getTeamByProject,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  GetUser
} from "./Team.js";

const app = express();
const port = process.env.PORT || 5050;



app.use(cors());
app.use(express.json());

// Project
app.get("/todos", GetAllProj);
app.get("/todos/:id", GetProj);
app.post("/todos", createProj);
app.delete("/todos/:id", DeleteTodo);
app.put("/todos/:id", UpdateProj);

// Sub task
app.get("/sub", getAllSub);
app.post("/sub", createSub);
app.delete("/sub/:id", deleteSub);
app.put("/sub/:id", EditSub);

// Sign_in
app.post("/sign", CreateAcc);
app.post("/login", LogIn);

// Team Members Routes
app.get("/team", getTeamMembers);
app.get("/team/project/:project_id", getTeamByProject);
app.post("/team", addTeamMember);
app.put("/team/:id", updateTeamMember);
app.delete("/team/:id", deleteTeamMember);
//get team member info
app.get("/user/:id", GetUser);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
